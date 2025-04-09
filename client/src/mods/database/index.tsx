import { Errors } from "@/libs/errors";
import { ChildrenProps } from "@/libs/react/props/children";
import { Nullable, Option } from "@hazae41/option";
import { Database } from "@hazae41/serac";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const DatabaseContext = createContext<Nullable<Database>>(null)

export function useDatabaseContext() {
  return Option.wrap(useContext(DatabaseContext))
}

export function DatabaseProvider(props: ChildrenProps) {
  const { children } = props

  const [database, setDatabase] = useState<Database>()

  const open = useCallback(() => Errors.runOrLogAndAlert(async () => {
    const database = await Database.openOrThrow("meta", 1, () => { })

    for await (const key of database.collectOrThrow())
      await database.deleteOrThrow(key)

    setDatabase(database)
  }), [])

  useEffect(() => {
    open()
  }, [])

  useEffect(() => () => {
    database?.database.close()
  }, [database])

  return <DatabaseContext.Provider value={database}>
    {children}
  </DatabaseContext.Provider>
}