import { Errors, NotAnError } from "@/libs/errors";
import { Nullable } from "@/libs/nullable";
import { ChildrenProps } from "@/libs/react/props/children";
import { Setter } from "@/libs/react/state";
import { useDatabaseContext } from "@/mods/database";
import { Disposer } from "@hazae41/box";
import { NetWorker } from "@hazae41/networker";
import { Option } from "@hazae41/option";
import { AutoPool } from "@hazae41/piscine";
import { createContext, JSX, useContext, useEffect, useMemo, useState } from "react";

export type MiningMode =
  | "stop"
  | "loop"

export interface MiningSettings {
  readonly mode: MiningMode
  readonly size: string
  readonly minimum: string
}

export interface MiningHandle {
  readonly settings: Nullable<Partial<MiningSettings>>
  readonly setSettings: Setter<Nullable<Partial<MiningSettings>>>

  readonly logs: JSX.Element[]
  readonly setLogs: Setter<JSX.Element[]>

  readonly aborter: Nullable<AbortController>
  readonly setAborter: Setter<Nullable<AbortController>>

  readonly workers: AutoPool<NetWorker>
}

export const MiningContext = createContext<Nullable<MiningHandle>>(null)

export function useMiningContext() {
  return Option.wrap(useContext(MiningContext))
}

export function MiningProvider(props: ChildrenProps) {
  const database = useDatabaseContext().getOrThrow()
  const { children } = props

  const [settings, setSettings] = useState<Nullable<Partial<MiningSettings>>>()

  useEffect(() => {
    database.getOrThrow<Partial<MiningSettings>>("settings").then(setSettings).catch(Errors.logAndAlert)
  }, [database])

  useEffect(() => {
    database.setOrThrow("settings", settings).catch(Errors.logAndAlert)
  }, [settings])

  const [logs, setLogs] = useState<JSX.Element[]>([])

  const workers = useMemo(() => new AutoPool<NetWorker>(async () => {
    return Disposer.wrap(new NetWorker())
  }, navigator.hardwareConcurrency - 1), [])

  useEffect(() => () => {
    using _ = workers
  }, [workers])

  const [aborter, setAborter] = useState<Nullable<AbortController>>()

  useEffect(() => () => {
    aborter?.abort(new NotAnError())
  }, [aborter])

  const handle = useMemo<MiningHandle>(() => ({
    settings,
    setSettings,

    logs,
    setLogs,

    aborter,
    setAborter,

    workers,
  }), [settings, setSettings, logs, setLogs, aborter, setAborter, workers])

  return <MiningContext.Provider value={handle}>
    {children}
  </MiningContext.Provider>
}