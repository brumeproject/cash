import { Errors, NotAnError, UIError } from "@/libs/errors";
import { Outline } from "@/libs/heroicons";
import { ClickableContrastAnchor } from "@/libs/ui/anchors";
import { WideClickableOppositeButton } from "@/libs/ui/buttons";
import { Dialog } from "@/libs/ui/dialog";
import { Loading } from "@/libs/ui/loading";
import { Locale } from "@/mods/locale";
import { useLocaleContext } from "@/mods/locale/mods/context";
import { AsyncStack, Deferred } from "@hazae41/box";
import { HashSubpathProvider, useCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { NetMixin } from "@hazae41/networker";
import { ChangeEvent, Fragment, useCallback } from "react";
import { bytesToHex } from "viem";
import { useMiningContext } from "../provider";
import { useWalletContext, WalletDialog } from "../wallet";

export function MiningDialog() {
  const path = usePathContext().getOrThrow()
  const locale = useLocaleContext().getOrThrow()
  const account = useWalletContext().getOrThrow()

  const {
    settings,
    setSettings,

    logs,
    setLogs,

    aborter,
    setAborter,

    workers
  } = useMiningContext().getOrThrow()

  const hash = useHashSubpath(path)

  const $wallet = useCoords(hash, "/wallet")
  const $settings = useCoords(hash, "/settings")

  const generateOrThrow = useCallback(async (size: number, minimum: bigint, signal: AbortSignal) => {
    const contractZeroHex = "0xabc755011B810fDC31F3504f0F855cadFcb2685A".toLowerCase()
    const receiverZeroHex = account.current.viemAccount.address.toLowerCase()

    const nonceBytes = crypto.getRandomValues(new Uint8Array(32))
    const nonceZeroHex = bytesToHex(nonceBytes)

    const minimumBigInt = minimum
    const minimumZeroHex = `0x${minimumBigInt.toString(16)}`

    const signatureZeroHex = await account.current.viemAccount.signMessage({ message: nonceZeroHex })

    const premixins = new Array<Promise<NetMixin>>()

    for (let i = 0; i < workers.capacity; i++)
      premixins.push(workers.getOrThrow(i).getOrThrow().get().createOrThrow({ contractZeroHex, receiverZeroHex, nonceZeroHex }))

    await using mixins = new AsyncStack(await Promise.all(premixins))

    let secretsZeroHex = "0x"

    async function generate() {
      using borrow = await workers.waitRandomOrThrow(x => x?.getOrNull()?.borrowOrNull(), signal)

      const index = borrow.getOrThrow().index
      const mixin = mixins.array[index]

      const generated = await mixin.generateOrThrow(minimumZeroHex)

      secretsZeroHex += generated.secretZeroHex.slice(2)

      const valueBigInt = BigInt(generated.valueZeroHex)
      const valueString = valueBigInt.toString()

      setLogs(logs => [
        <Fragment key={crypto.randomUUID()}>
          <div className="text-default-contrast">
            {Locale.get(Locale.YouGeneratedX, locale)(`${valueString} sparks`)}
          </div>
        </Fragment>,
        ...logs
      ])
    }

    const promises = new Array<Promise<void>>()

    for (let i = 0; i < size; i++)
      promises.push(generate())

    await Promise.all(promises)

    signal.throwIfAborted()

    return { nonceZeroHex, secretsZeroHex, signatureZeroHex }
  }, [account, workers, locale])

  interface Claimable {
    readonly secretsZeroHex: string
    readonly signatureZeroHex: string
    readonly nonceZeroHex: string
  }

  const claimOrThrow = useCallback(async (data: Claimable, signal: AbortSignal) => {
    const { secretsZeroHex, signatureZeroHex, nonceZeroHex } = data

    const headers = { "Content-Type": "application/json" }
    const body = JSON.stringify({ nonceZeroHex, secretsZeroHex, signatureZeroHex })

    const response = await fetch("https://api.cash.brume.money/api/v0/generate", { method: "POST", headers, body, signal })

    if (!response.ok)
      throw new UIError("Could not claim")

    const result = await response.json()

    setLogs(logs => [
      <Fragment key={crypto.randomUUID()}>
        <div className="">
          {Locale.get(Locale.YouEarnedX, locale)(`${result} tokens`)}
        </div>
      </Fragment>,
      ...logs
    ])
  }, [locale])

  const generateAndClaimOrThrow = useCallback(async (size: number, minimum: bigint, signal: AbortSignal) => {
    await claimOrThrow(await generateOrThrow(size, minimum, signal), signal)
  }, [generateOrThrow, claimOrThrow])

  const generateAndAsyncClaimOrLogAndAlertInLoopOrThrow = useCallback(async (size: number, minimum: bigint, signal: AbortSignal) => {
    while (!signal.aborted) claimOrThrow(await generateOrThrow(size, minimum, signal), signal).catch(Errors.logAndAlert)
  }, [generateOrThrow, claimOrThrow])

  const {
    mode = "stop",
    minimum = "1000000",
    size = "128"
  } = settings ?? {}

  const onModeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => Errors.runOrLogAndAlert(async () => {
    if (event.currentTarget.checked)
      setSettings(x => ({ ...x, mode: "loop" }))
    else
      setSettings(x => ({ ...x, mode: "stop" }))
  }), [])

  const onMinimumChange = useCallback((event: ChangeEvent<HTMLInputElement>) => Errors.runOrLogAndAlert(async () => {
    const minimumString = event.currentTarget.value
    const minimumBigInt = BigInt(minimumString)

    if (minimumBigInt < 1n)
      throw new UIError("Minimum must be greater than or equals to 1")

    setSettings(x => ({ ...x, minimum: minimumString }))
  }), [])

  const onSizeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => Errors.runOrLogAndAlert(async () => {
    const sizeString = event.currentTarget.value
    const sizeNumber = Number(sizeString)

    if (sizeNumber < 1 || sizeNumber > 2048)
      throw new UIError("Size must be between 1 and 2048")

    setSettings(x => ({ ...x, size: sizeString }))
  }), [])

  const onGenerateClick = useCallback(() => Errors.runOrLogAndAlert(async () => {
    if (aborter != null)
      return void aborter.abort(new NotAnError())

    {
      const aborter = new AbortController()

      const { signal } = aborter

      setAborter(aborter)

      using _ = new Deferred(() => setAborter(undefined))

      const minimumString = minimum
      const minimumBigInt = BigInt(minimumString)

      const sizeString = size
      const sizeNumber = Number(sizeString)

      if (mode === "stop")
        await generateAndClaimOrThrow(sizeNumber, minimumBigInt, signal)
      else
        await generateAndAsyncClaimOrLogAndAlertInLoopOrThrow(sizeNumber, minimumBigInt, signal)

      //
    }
  }), [aborter, mode, size, minimum, generateAndClaimOrThrow, generateAndAsyncClaimOrLogAndAlertInLoopOrThrow])

  return <>
    <h1 className="text-2xl font-medium">
      {Locale.get(Locale.SuperGenerator2048, locale)}
    </h1>
    <div className="text-default-contrast">
      {Locale.get({
        en: `Generate sparks and claim tokens`,
        zh: `生成火花并索取代币`,
        hi: `बिजली उत्पन्न करें और टोकन का दावा करें`,
        es: `Genere chispas y reclame tokens`,
        ar: `توليد الشرر والمطالبة بالرموز`,
        fr: `Générez des étincelles et réclamez des jetons`,
        de: `Generieren Sie Funken und fordern Sie Token an`,
        ru: `Генерируйте искры и требуйте токены`,
        pt: `Gere faíscas e reivindique tokens`,
        ja: `スパークを生成してトークンを請求する`,
        pa: `ਸਪਾਰਕ ਉਤਪਾਦਿਤ ਕਰੋ ਅਤੇ ਟੋਕਨ ਦਾਵਾ ਕਰੋ`,
        bn: `স্পার্ক উৎপাদন করুন এবং টোকেন দাবি করুন`,
        id: `Hasilkan percikan dan klaim token`,
        ur: `سپارک جنریٹ کریں اور ٹوکن کا دعویٰ کریں`,
        ms: `Hasilkan percikan dan tuntut token`,
        it: `Genera scintille e richiedi token`,
        tr: `Kıvılcım üretin ve jetonları talep edin`,
        ta: `விழுந்து உருவாக்குகிறது மற்றும் டோக்கன்களை கோருங்கள்`,
        te: `స్పార్క్స్ ను ఉత్పత్తించండి మరియు టోకెన్లను దావం చేయండి`,
        ko: `스파크를 생성하고 토큰을 청구하십시오`,
        vi: `Tạo ra tia lửa và yêu cầu token`,
        pl: `Generuj iskry i żądaj tokenów`,
        ro: `Generați scântei și revendicați tokeni`,
        nl: `Genereer vonken en claim tokens`,
        el: `Δημιουργήστε αστραπές και απαιτήστε τα token`,
        th: `สร้างประกายและเรียกร้องโทเค็น`,
        cs: `Generujte jiskry a požadujte tokeny`,
        hu: `Szikrákat generáljon és igényeljen tokeneket`,
        sv: `Generera gnistor och kräv token`,
        da: `Generer gnister og kræv token`,
      }, locale)}
    </div>
    <div className="h-4" />
    <HashSubpathProvider>
      {hash.url.pathname === "/settings" &&
        <Dialog>
          <h1 className="text-2xl font-medium">
            {Locale.get(Locale.Settings, locale)}
          </h1>
          <div className="h-4" />
          <div className="font-medium">
            {Locale.get({
              en: "Continuous generation",
              zh: "连续生成",
              hi: "निरंतर पीढ़ी",
              es: "Generación continua",
              ar: "توليد مستمر",
              fr: "Génération continue",
              de: "Kontinuierliche Generierung",
              ru: "Непрерывная генерация",
              pt: "Geração contínua",
              ja: "連続生成",
              pa: "ਲਗਾਤਾਰ ਉਤਪਾਦਨ",
              bn: "অবিরত উৎপাদন",
              id: "Pembangkitan berkelanjutan",
              ur: "مسلسل تولید",
              ms: "Penghasilan berterusan",
              it: "Generazione continua",
              tr: "Sürekli üretim",
              ta: "தொடர்ந்த உற்பத்தி",
              te: "కొనసాగిపెట్టడం",
              ko: "연속 생성",
              vi: "Tạo liên tục",
              pl: "Ciągłe generowanie",
              ro: "Generare continuă",
              nl: "Doorlopende generatie",
              el: "Συνεχής δημιουργία",
              th: "การสร้างต่อเนื่อง",
              cs: "Kontinuální generování",
              hu: "Folyamatos generálás",
              sv: "Kontinuerlig generering",
              da: "Kontinuerlig generering",
            }, locale)}
          </div>
          <div className="text-default-contrast">
            {Locale.get({
              en: `Generate continuously until you manually stop`,
              zh: `连续生成，直到您手动停止`,
              hi: `मैन्युअल रूप से रोकने तक निरंतर उत्पन्न करें`,
              es: `Genere continuamente hasta que detenga manualmente`,
              ar: `توليد بشكل مستمر حتى تتوقف يدويًا`,
              fr: `Générer en continu jusqu'à ce que vous arrêtiez manuellement`,
              de: `Generieren Sie kontinuierlich, bis Sie manuell anhalten`,
              ru: `Генерировать непрерывно, пока вы не остановите вручную`,
              pt: `Gerar continuamente até você parar manualmente`,
              ja: `手動で停止するまで連続生成します`,
              pa: `ਮੈਨੂਅਲ ਰੂਪ ਵਿੱਚ ਰੋਕਣ ਲਈ ਨਿਰੰਤਰ ਉਤਪਾਦਿਤ ਕਰੋ`,
              bn: `ম্যানুয়ালি থামার পর্যন্ত অবিরত উৎপাদন করুন`,
              id: `Menghasilkan terus menerus hingga Anda berhenti secara manual`,
              ur: `میں ہاتھ سے رکنے تک مسلسل تولید کریں`,
              ms: `Hasilkan secara berterusan sehingga anda berhenti secara manual`,
              it: `Genera continuamente fino a quando non ti fermi manualmente`,
              tr: `Manuel olarak durana kadar sürekli üretin`,
              ta: `கைமுறையாக நிறுத்துவதற்கு வரை தொடர்ந்த உற்பத்தியை உருவாக்கவும்`,
              te: `మాన్యువల్గా ఆపరుతుకు వరకు కొనసాగిపెట్టడం`,
              ko: `수동으로 중지할 때까지 계속 생성합니다`,
              vi: `Tạo liên tục cho đến khi bạn dừng bằng tay`,
              pl: `Generuj ciągle, aż ręcznie zatrzymasz`,
              ro: `Generați continuu până când opriți manual`,
              nl: `Genereer continu totdat u handmatig stopt`,
              el: `Δημιουργήστε συνεχώς μέχρι να σταματήσετε χειροκίνητα`,
              th: `สร้างต่อเนื่องจนกว่าคุณจะหยุดด้วยตนเอง`,
              cs: `Generujte nepřetržitě, dokud nezastavíte ručně`,
              hu: `Folyamatosan generáljon, amíg kézzel meg nem állítja`,
              sv: `Generera kontinuerligt tills du stoppar manuellt`,
              da: `Generer kontinuerligt, indtil du stopper manuelt`,
            }, locale)}
          </div>
          <div className="h-2" />
          <label className="flex items-center bg-default-contrast rounded-xl po-2 gap-2 *:shrink-0">
            {Locale.get(Locale.Enabled, locale)}
            <div className="grow" />
            <input type="checkbox"
              onChange={onModeChange}
              checked={mode === "loop"} />
          </label>
          <div className="h-4" />
          <div className="font-medium">
            {Locale.get({
              en: "Minimum value",
              zh: "最小值",
              hi: "न्यूनतम मान",
              es: "Valor mínimo",
              ar: "القيمة الدنيا",
              fr: "Valeur minimale",
              de: "Minimalwert",
              ru: "Минимальное значение",
              pt: "Valor mínimo",
              ja: "最小値",
              pa: "ਨਿਮਣ ਮੁੱਲ",
              bn: "ন্যূনতম মান",
              id: "Nilai minimum",
              ur: "کم سے کم قیمت",
              ms: "Nilai minimum",
              it: "Valore minimo",
              tr: "Minimum değer",
              ta: "குறைந்த மதிப்பு",
              te: "కనిష్ట విలువ",
              ko: "최소 값",
              vi: "Giá trị tối thiểu",
              pl: "Minimalna wartość",
              ro: "Valoare minimă",
              nl: "Minimale waarde",
              el: "Ελάχιστη τιμή",
              th: "ค่าต่ำสุด",
              cs: "Minimální hodnota",
              hu: "Minimális érték",
              sv: "Minsta värde",
              da: "Minimumsværdi",
            }, locale)}
          </div>
          <div className="text-default-contrast">
            {Locale.get({
              en: `Minimum value to generate`,
              zh: `生成的最小值`,
              hi: `निर्माण के लिए न्यूनतम मान`,
              es: `Valor mínimo a generar`,
              ar: `القيمة الدنيا للتوليد`,
              fr: `Valeur minimale à générer`,
              de: `Minimalwert zum Generieren`,
              ru: `Минимальное значение для генерации`,
              pt: `Valor mínimo a gerar`,
              ja: `生成する最小値`,
              pa: `ਉਤਪਾਦਿਤ ਕਰਨ ਲਈ ਨਿਮਣ ਮੁੱਲ`,
              bn: `উৎপাদন করার জন্য ন্যূনতম মান`,
              id: `Nilai minimum yang akan dihasilkan`,
              ur: `تولید کرنے کی کم سے کم قیمت`,
              ms: `Nilai minimum yang akan dihasilkan`,
              it: `Valore minimo da generare`,
              tr: `Üretmek için minimum değer`,
              ta: `உற்பத்திப்படுத்த குறைந்த மதிப்பு`,
              te: `ఉత్పత్తించడానికి కనిష్ట విలువ`,
              ko: `생성할 최소 값`,
              vi: `Giá trị tối thiểu cần tạo`,
              pl: `Minimalna wartość do wygenerowania`,
              ro: `Valoare minimă de generat`,
              nl: `Minimale waarde om te genereren`,
              el: `Ελάχιστη τιμή για δημιουργία`,
              th: `ค่าต่ำสุดที่จะสร้าง`,
              cs: `Minimální hodnota k vygenerování`,
              hu: `Generálandó minimális érték`,
              sv: `Minsta värde att generera`,
              da: `Minimumsværdi at generere`,
            }, locale)}
          </div>
          <div className="h-2" />
          <label className="flex items-center bg-default-contrast rounded-xl po-2 gap-2 *:shrink-0">
            {Locale.get(Locale.Value, locale)}
            <div className="text-default-contrast">1 — +∞</div>
            <div className="grow" />
            <input type="number" className="outline-none text-end"
              onChange={onMinimumChange}
              value={minimum} />
          </label>
          <div className="h-4" />
          <div className="font-medium">
            {Locale.get({
              en: "Bucket size",
              zh: "桶大小",
              hi: "बाल्टी का आकार",
              es: "Tamaño del cubo",
              ar: "حجم الدلو",
              fr: "Taille du seau",
              de: "Eimergröße",
              ru: "Размер ведра",
              pt: "Tamanho do balde",
              ja: "バケットサイズ",
              pa: "ਬਕੈਟ ਦਾ ਆਕਾਰ",
              bn: "বাল্টির আকার",
              id: "Ukuran ember",
              ur: "بکٹ کا سائز",
              ms: "Saiz baldi",
              it: "Dimensione del secchio",
              tr: "Kova boyutu",
              ta: "குப்பை அளவு",
              te: "బకెట్ పరిమాణం",
              ko: "버킷 크기",
              vi: "Kích thước thùng",
              pl: "Rozmiar wiadra",
              ro: "Dimensiunea găleții",
              nl: "Emmergrootte",
              el: "Μέγεθος κουβά",
              th: "ขนาดถัง",
              cs: "Velikost kyblíku",
              hu: "Vödör mérete",
              sv: "Hinkstorlek",
              da: "Spandstørrelse",
            }, locale)}
          </div>
          <div className="text-default-contrast">
            {Locale.get({
              en: `Number of generations before claiming`,
              zh: `索取前的生成次数`,
              hi: `दावा करने से पहले पीढ़ी की संख्या`,
              es: `Número de generaciones antes de reclamar`,
              ar: `عدد الأجيال قبل المطالبة`,
              fr: `Nombre de générations avant de réclamer`,
              de: `Anzahl der Generationen vor dem Anspruch`,
              ru: `Количество поколений перед требованием`,
              pt: `Número de gerações antes de reivindicar`,
              ja: `請求前の世代数`,
              pa: `ਦਾਵਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਪੀੜੀਆਂ ਦੀ ਗਿਣਤੀ`,
              bn: `দাবি করার আগে প্রজননের সংখ্যা`,
              id: `Jumlah generasi sebelum klaim`,
              ur: `دعوہ کرنے سے پہلے نسلوں کی تعداد`,
              ms: `Bilangan generasi sebelum tuntutan`,
              it: `Numero di generazioni prima della richiesta`,
              tr: `Talepten önceki nesil sayısı`,
              ta: `கோரிக்கை முன்னே தாவரவளவுகளின் எண்ணிக்கை`,
              te: `దావా చేయడం ముందు పెంపుల సంఖ్య`,
              ko: `청구 전 세대 수`,
              vi: `Số thế hệ trước khi yêu cầu`,
              pl: `Liczba pokoleń przed roszczeniem`,
              ro: `Numărul de generații înainte de revendicare`,
              nl: `Aantal generaties voor claimen`,
              el: `Αριθμός γενεών πριν την απαίτηση`,
              th: `จำนวนรุ่นก่อนเรียกร้อง`,
              cs: `Počet generací před nárokem`,
              hu: `Generációk száma a követelés előtt`,
              sv: `Antal generationer innan krav`,
              da: `Antal generationer før krav`,
            }, locale)}
          </div>
          <div className="h-2" />
          <label className="flex items-center bg-default-contrast rounded-xl po-2 gap-2 *:shrink-0">
            {Locale.get(Locale.Value, locale)}
            <div className="text-default-contrast">1 — 2048</div>
            <div className="grow" />
            <input type="number" className="outline-none text-end"
              onChange={onSizeChange}
              value={size} />
          </label>
        </Dialog>}
      {hash.url.pathname === "/wallet" &&
        <WalletDialog />}
    </HashSubpathProvider>
    <div className="h-[300px] p-1 grow flex flex-col border border-default-contrast rounded-xl">
      <div className="po-1 grow overflow-y-auto flex flex-col gap-2">
        {logs.map((log, i) =>
          <Fragment key={i}>
            {log}
          </Fragment>)}
      </div>
    </div>
    <div className="h-2" />
    <div className="flex items-center flex-wrap-reverse gap-2">
      <WideClickableOppositeButton
        onClick={onGenerateClick}>
        {aborter != null
          ? <Loading className="size-5" />
          : <Outline.BoltIcon className="size-5" />}
        {aborter == null && Locale.get(Locale.Generate, locale)}
        {aborter != null && aborter.signal.aborted && Locale.get(Locale.Stopping, locale)}
        {aborter != null && !aborter.signal.aborted && Locale.get(Locale.Generating, locale)}
      </WideClickableOppositeButton>
      <ClickableContrastAnchor
        aria-disabled={aborter != null}
        onKeyDown={aborter == null ? $settings.onKeyDown : undefined}
        onClick={aborter == null ? $settings.onClick : undefined}
        href={aborter == null ? $settings.href : undefined}>
        <div className="p-1">
          <Outline.EllipsisVerticalIcon className="size-5" />
        </div>
      </ClickableContrastAnchor>
      <ClickableContrastAnchor
        aria-disabled={aborter != null}
        onKeyDown={aborter == null ? $wallet.onKeyDown : undefined}
        onClick={aborter == null ? $wallet.onClick : undefined}
        href={aborter == null ? $wallet.href : undefined}>
        <div className="p-1">
          <Outline.WalletIcon className="size-5" />
        </div>
      </ClickableContrastAnchor>
    </div>
  </>
}