import { Errors, UIError } from "@/libs/errors";
import { Outline } from "@/libs/heroicons";
import { ClickableOppositeAnchor, TextAnchor } from "@/libs/ui/anchors";
import { ClickableOppositeButton } from "@/libs/ui/buttons";
import { Dialog } from "@/libs/ui/dialog";
import { Loading } from "@/libs/ui/loading";
import { useWriter } from "@/libs/writer";
import { HashSubpathProvider, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { NetWorker } from "@hazae41/networker";
import Head from "next/head";
import { Fragment, useCallback, useMemo, useState } from "react";
import { bytesToHex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { Locale } from "../locale";
import { useLocaleContext } from "../locale/mods/context";

const account = privateKeyToAccount(generatePrivateKey())

const contractZeroHex = "0xabc755011B810fDC31F3504f0F855cadFcb2685A".toLowerCase()
const receiverZeroHex = account.address.toLowerCase()

export function Page() {
  const path = usePathContext().getOrThrow()
  const locale = useLocaleContext().getOrThrow()

  const hash = useHashSubpath(path)

  const [logs, setLogs] = useState<string[]>([])

  const [loading, setLoading] = useState(false)

  const generate = useCallback(() => Errors.runOrLogAndAlert(async () => {
    try {
      setLoading(true)

      using worker = new NetWorker()

      const nonceBytes = crypto.getRandomValues(new Uint8Array(32))
      const nonceZeroHex = bytesToHex(nonceBytes)

      await using mixin = await worker.createOrThrow({ contractZeroHex, receiverZeroHex, nonceZeroHex })

      const minimumBigInt = BigInt(100000)
      const minimumZeroHex = `0x${minimumBigInt.toString(16)}`

      const generated = await mixin.generateOrThrow(minimumZeroHex)

      const secretsZeroHex = `0x${generated.secretZeroHex.slice(2)}`
      const signatureZeroHex = await account.signMessage({ message: nonceZeroHex })

      const headers = { "Content-Type": "application/json" }
      const body = JSON.stringify({ nonceZeroHex, secretsZeroHex, signatureZeroHex })

      const response = await fetch("https://api.cash.brume.money/api/generate", { method: "POST", headers, body })

      if (!response.ok)
        throw new UIError("Could not claim")

      const valueZeroHex = await response.json()
      const valueBigInt = BigInt(valueZeroHex)

      setLogs(logs => [Locale.get(Locale.YouGeneratedX, locale)(`${valueBigInt.toString()} wei`), ...logs])
    } finally {
      setLoading(false)
    }
  }), [])

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
      {hash.url.pathname === "/mint" &&
        <Dialog>
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
          <ClickableOppositeButton
            disabled={loading}
            onClick={generate}>
            {loading
              ? <Loading className="size-5" />
              : <Outline.BoltIcon className="size-5" />}
            {Locale.get(Locale.Generate, locale)}
          </ClickableOppositeButton>
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
            href={hash.go("/mint").href}
            aria-disabled={loading}>
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
