import { Errors, NotAnError, UIError } from "@/libs/errors";
import { Outline } from "@/libs/heroicons";
import { ClickableContrastAnchor, ClickableOppositeAnchor, TextAnchor } from "@/libs/ui/anchors";
import { WideClickableOppositeButton } from "@/libs/ui/buttons";
import { Dialog } from "@/libs/ui/dialog";
import { Loading } from "@/libs/ui/loading";
import { useWriter } from "@/libs/writer";
import { HashSubpathProvider, useCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { NetWorker } from "@hazae41/networker";
import Head from "next/head";
import { ChangeEvent, Fragment, useCallback, useMemo, useState } from "react";
import { bytesToHex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { Locale } from "../locale";
import { useLocaleContext } from "../locale/mods/context";

const account = privateKeyToAccount(generatePrivateKey())

const contractZeroHex = "0xabc755011B810fDC31F3504f0F855cadFcb2685A".toLowerCase()
const receiverZeroHex = account.address.toLowerCase()

function Console() {
  const path = usePathContext().getOrThrow()
  const locale = useLocaleContext().getOrThrow()

  const hash = useHashSubpath(path)

  const settings = useCoords(hash, "/settings")

  const [logs, setLogs] = useState<string[]>([])

  const generateAndStop = useCallback((minimum: bigint, signal: AbortSignal) => Errors.runOrLogAndAlert(async () => {
    using worker = new NetWorker()

    const nonceBytes = crypto.getRandomValues(new Uint8Array(32))
    const nonceZeroHex = bytesToHex(nonceBytes)

    await using mixin = await worker.createOrThrow({ contractZeroHex, receiverZeroHex, nonceZeroHex })

    const minimumBigInt = minimum
    const minimumZeroHex = `0x${minimumBigInt.toString(16)}`

    const generated = await mixin.generateOrThrow(minimumZeroHex)

    const secretsZeroHex = `0x${generated.secretZeroHex.slice(2)}`
    const signatureZeroHex = await account.signMessage({ message: nonceZeroHex })

    const headers = { "Content-Type": "application/json" }
    const body = JSON.stringify({ nonceZeroHex, secretsZeroHex, signatureZeroHex })

    const response = await fetch("https://api.cash.brume.money/api/generate", { method: "POST", headers, body, signal })

    if (!response.ok)
      throw new UIError("Could not claim")

    const valueZeroHex = await response.json()
    const valueBigInt = BigInt(valueZeroHex)

    setLogs(logs => [Locale.get(Locale.YouGeneratedX, locale)(`${valueBigInt.toString()} wei`), ...logs])
  }), [])

  const generateAndLoop = useCallback(async (minimum: bigint, signal: AbortSignal) => {
    while (!signal.aborted)
      await generateAndStop(minimum, signal)

    //
  }, [])

  const [loop, setLoop] = useState(false)

  const onLoopChange = useCallback((event: ChangeEvent<HTMLInputElement>) => Errors.runOrLogAndAlert(async () => {
    setLoop(event.currentTarget.checked)
  }), [])

  const [minimum, setMinimum] = useState("1000000")

  const onMinimumChange = useCallback((event: ChangeEvent<HTMLInputElement>) => Errors.runOrLogAndAlert(async () => {
    setMinimum(event.currentTarget.value)
  }), [])

  const [aborter, setAborter] = useState<AbortController>()

  const onGenerateClick = useCallback(() => Errors.runOrLogAndAlert(async () => {
    if (aborter != null)
      return void aborter.abort(new NotAnError())

    {
      const aborter = new AbortController()

      try {
        const { signal } = aborter

        setAborter(aborter)

        const minimumString = minimum
        const minimumBigInt = BigInt(minimumString)

        if (loop)
          await generateAndLoop(minimumBigInt, signal)
        else
          await generateAndStop(minimumBigInt, signal)

        //
      } finally {
        setAborter(undefined)
      }
    }
  }), [aborter, loop, minimum])

  return <>
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
          <label className="flex items-center justify-between bg-default-contrast rounded-xl po-2">
            {Locale.get(Locale.Enabled, locale)}
            <input type="checkbox"
              onChange={onLoopChange}
              checked={loop} />
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
              en: `Minimum wei value of each generation`,
              zh: `每代的最小 wei 值`,
              hi: `प्रत्येक पीढ़ी का न्यूनतम wei मूल्य`,
              es: `Valor mínimo de wei de cada generación`,
              ar: `القيمة الدنيا لكل جيل`,
              fr: `Valeur minimale de wei de chaque génération`,
              de: `Minimaler wei-Wert jeder Generation`,
              ru: `Минимальное значение wei каждого поколения`,
              pt: `Valor mínimo de wei de cada geração`,
              ja: `各世代の最小 wei 値`,
              pa: `ਹਰ ਪੀੜੀ ਦਾ ਨਿਮਣ ਵੇਵ ਮੁੱਲ`,
              bn: `প্রতিটি প্রজন্মের ন্যূনতম উই মান`,
              id: `Nilai wei minimum dari setiap generasi`,
              ur: `ہر نسل کی کم سے کم وی مقدار`,
              ms: `Nilai wei minimum setiap generasi`,
              it: `Valore wei minimo di ogni generazione`,
              tr: `Her neslin minimum wei değeri`,
              ta: `ஒவ்வொரு தலைவர்களின் குறைந்த wei மதிப்பு`,
              te: `ప్రతి పీడని కనిష్ట వి మూల్యం`,
              ko: `각 세대의 최소 wei 값`,
              vi: `Giá trị wei tối thiểu của mỗi thế hệ`,
              pl: `Minimalna wartość wei każdego pokolenia`,
              ro: `Valoarea minimă wei a fiecărei generații`,
              nl: `Minimale wei-waarde van elke generatie`,
              el: `Ελάχιστη τιμή wei κάθε γενιάς`,
              th: `ค่า wei ต่ำสุดของแต่ละรุ่น`,
              cs: `Minimální hodnota wei každé generace`,
              hu: `Minden generáció minimális wei értéke`,
              sv: `Minsta wei-värde för varje generation`,
              da: `Minimum wei-værdi for hver generation`,
            }, locale)}
          </div>
          <div className="h-2" />
          <label className="flex items-center justify-between bg-default-contrast rounded-xl po-2">
            {Locale.get(Locale.Value, locale)}
            <input type="number" className="outline-none text-end"
              onChange={onMinimumChange}
              value={minimum} />
          </label>
        </Dialog>}
    </HashSubpathProvider>
    <div className="h-[300px] p-1 grow flex flex-col border border-default-contrast rounded-xl">
      <div className="po-1 grow overflow-y-auto flex flex-col gap-2">
        {logs.map((log, i) =>
          <Fragment key={i}>
            <div className="text-default-contrast">
              {log}
            </div>
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
        {aborter != null
          ? Locale.get(Locale.Generating, locale)
          : Locale.get(Locale.Generate, locale)}
      </WideClickableOppositeButton>
      <ClickableContrastAnchor
        onKeyDown={settings.onKeyDown}
        onClick={settings.onClick}
        href={settings.href}>
        <div className="p-1">
          <Outline.EllipsisVerticalIcon className="size-5" />
        </div>
      </ClickableContrastAnchor>
    </div>
  </>
}

export function Page() {
  const path = usePathContext().getOrThrow()
  const locale = useLocaleContext().getOrThrow()

  const hash = useHashSubpath(path)

  const generate = useCoords(hash, "/generate")

  const sentences = useMemo(() => [
    Locale.get(Locale.MonetizeAnyService, locale),
    Locale.get(Locale.MonetizeAnyWebsite, locale),
    Locale.get(Locale.MonetizeAnyApp, locale),
    Locale.get(Locale.MonetizeAnyAPI, locale),
    Locale.get(Locale.MonetizeAnyContent, locale),
  ], [])

  const display = useWriter(sentences)

  return <div id="root" className="p-safe h-full w-full flex flex-col overflow-y-scroll animate-opacity-in">
    <Head>
      <title>Brume Cash</title>
    </Head>
    <HashSubpathProvider>
      {hash.url.pathname === "/generate" &&
        <Dialog>
          <Console />
        </Dialog>}
    </HashSubpathProvider>
    <div className="p-4 grow w-full m-auto max-w-3xl flex flex-col">
      <div className="h-[max(24rem,100dvh_-_16rem)] flex-none flex flex-col items-center">
        <div className="grow" />
        <h1 className="text-center text-6xl font-medium">
          {display}
        </h1>
        <div className="h-4" />
        <div className="text-center text-default-contrast text-2xl">
          {Locale.get(Locale.MakeYourUsersPayAnonymouslyWithTheirComputation, locale)}
        </div>
        <div className="grow" />
        <div className="flex items-center">
          <ClickableOppositeAnchor
            onKeyDown={generate.onKeyDown}
            onClick={generate.onClick}
            href={generate.href}>
            <Outline.BoltIcon className="size-5" />
            {Locale.get(Locale.Try, locale)}
          </ClickableOppositeAnchor>
        </div>
        <div className="grow" />
        <div className="grow" />
      </div>
      <div className="h-[50vh]" />
      <div className="p-4 flex items-center justify-center gap-2">
        <TextAnchor
          target="_blank" rel="noreferrer"
          href="https://brume.money">
          {Locale.get(Locale.MadeByCypherpunks, locale)}
        </TextAnchor>
        <span>
          ·
        </span>
        <span>
          v{process.env.VERSION}
        </span>
      </div>
    </div>
  </div>
}
