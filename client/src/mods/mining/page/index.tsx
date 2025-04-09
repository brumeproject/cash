import { Outline } from "@/libs/heroicons";
import { ClickableOppositeAnchor, TextAnchor } from "@/libs/ui/anchors";
import { Dialog } from "@/libs/ui/dialog";
import { useWriter } from "@/libs/writer";
import { HashSubpathProvider, useCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import Head from "next/head";
import { useMemo } from "react";
import { Locale } from "../../locale";
import { useLocaleContext } from "../../locale/mods/context";
import { WalletProvider } from "../generator/account";
import { MiningGeneratorDialog } from "../generator/dialog";

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
          <WalletProvider>
            <MiningGeneratorDialog />
          </WalletProvider>
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
