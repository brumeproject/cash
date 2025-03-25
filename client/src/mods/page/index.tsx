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
            Continuous generation
          </div>
          <div className="text-default-contrast">
            {`Generate continuously until you manually stop`}
          </div>
          <div className="h-2" />
          <label className="flex items-center justify-between bg-default-contrast rounded-xl po-2">
            Enabled
            <input type="checkbox"
              onChange={onLoopChange}
              checked={loop} />
          </label>
          <div className="h-4" />
          <div className="font-medium">
            Minimum value
          </div>
          <div className="text-default-contrast">
            {`Minimum wei value of each generation`}
          </div>
          <div className="h-2" />
          <label className="flex items-center justify-between bg-default-contrast rounded-xl po-2">
            Value
            <input type="number" className="outline-none text-right"
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
