import "@hazae41/symbol-dispose-polyfill";

import "@/styles/index.css";

import { Nullable } from "@/libs/nullable";
import { DatabaseProvider } from "@/mods/database";
import { MiningProvider } from "@/mods/mining/provider";
import { HashPathProvider } from "@hazae41/chemin";
import { Immutable } from "@hazae41/immutable";
import type { AppProps } from "next/app";
import { RefObject, useCallback, useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [update, setUpdate] = useState<RefObject<Nullable<() => Promise<void>>>>()

  useEffect(() => {
    navigator.serviceWorker.addEventListener("controllerchange", () => location.reload())
  }, [])

  const register = useCallback(async () => {
    setUpdate({ current: await Immutable.register("/service_worker.latest.js") })
  }, [])

  useEffect(() => {
    register().catch(console.error)
  }, [register])

  useEffect(() => {
    update?.current?.().catch(console.error)
  }, [update])

  useEffect(() => {
    console.log("update", update?.current)
  }, [update])

  const [client, setClient] = useState(false)

  useEffect(() => {
    setClient(true)
  }, [])

  if (!client)
    return null

  return <HashPathProvider>
    <DatabaseProvider>
      <MiningProvider>
        <Component {...pageProps} />
      </MiningProvider>
    </DatabaseProvider>
  </HashPathProvider>
}
