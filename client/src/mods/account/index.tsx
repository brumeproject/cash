import { Errors } from "@/libs/errors";
import { Nullable } from "@/libs/nullable";
import { ChildrenProps } from "@/libs/react/props/children";
import { Option } from "@hazae41/option";
import { Database } from "@hazae41/serac";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Hex, PrivateKeyAccount } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

export interface Account {
  readonly account: PrivateKeyAccount
  readonly privateKey: Hex
}

export const AccountContext = createContext<Nullable<Account>>(undefined)

export function useAccountContext() {
  return Option.wrap(useContext(AccountContext))
}

export function AccountProvider(props: ChildrenProps) {
  const { children } = props

  const [database, setDatabase] = useState<Database>()

  const getAndSetDatabase = useCallback(() => Errors.runOrLogAndAlert(async () => {
    const database = await Database.openOrThrow("meta", 1, () => { })

    for await (const key of database.collectOrThrow())
      await database.deleteOrThrow(key)

    setDatabase(database)
  }), [])

  useEffect(() => {
    getAndSetDatabase()
  }, [])

  const [account, setAccount] = useState<Account>()

  const getAndSetAccount = useCallback((database: Database) => Errors.runOrLogAndAlert(async () => {
    const stale = await database.getOrThrow<Hex>("account")

    if (stale != null) {
      const account = privateKeyToAccount(stale)
      const privateKey = stale

      return void setAccount({ account, privateKey })
    }

    const fresh = generatePrivateKey()

    database.setOrThrow("account", fresh)

    const account = privateKeyToAccount(fresh)
    const privateKey = fresh

    setAccount({ account, privateKey })
  }), [database])

  useEffect(() => {
    if (database == null)
      return
    getAndSetAccount(database)
  }, [database])

  if (account == null)
    return null

  return <AccountContext.Provider value={account}>
    {children}
  </AccountContext.Provider>
}