import { Errors } from "@/libs/errors";
import { Outline } from "@/libs/heroicons";
import { Nullable } from "@/libs/nullable";
import { ChildrenProps } from "@/libs/react/props/children";
import { WideClickableOppositeAnchor } from "@/libs/ui/anchors";
import { Dialog } from "@/libs/ui/dialog";
import { HashSubpathProvider, useCoords, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { Option } from "@hazae41/option";
import { Database } from "@hazae41/serac";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Hex, PrivateKeyAccount } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { Locale } from "../locale";
import { useLocaleContext } from "../locale/mods/context";

export interface AccountHandle {
  readonly account: PrivateKeyAccount
  readonly privateKey: Hex
}

export const AccountContext = createContext<Nullable<AccountHandle>>(undefined)

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

  const [handle, setHandle] = useState<AccountHandle>()

  const getAndSetAccount = useCallback((database: Database) => Errors.runOrLogAndAlert(async () => {
    const stale = await database.getOrThrow<Hex>("account")

    if (stale != null) {
      const account = privateKeyToAccount(stale)
      const privateKey = stale

      return void setHandle({ account, privateKey })
    }

    const fresh = generatePrivateKey()

    database.setOrThrow("account", fresh)

    const account = privateKeyToAccount(fresh)
    const privateKey = fresh

    setHandle({ account, privateKey })
  }), [database])

  useEffect(() => {
    if (database == null)
      return
    getAndSetAccount(database)
  }, [database])

  if (handle == null)
    return null

  return <AccountContext.Provider value={handle}>
    {children}
  </AccountContext.Provider>
}

export function WalletDialog() {
  const path = usePathContext().getOrThrow()
  const locale = useLocaleContext().getOrThrow()
  const { account, privateKey } = useAccountContext().getOrThrow()

  const hash = useHashSubpath(path)

  const connect = useCoords(hash, "/connect")

  const [reveal, setReveal] = useState(false)

  const onRevealClick = useCallback(() => Errors.runOrLogAndAlert(async () => {
    setReveal(true)
  }), [])

  return <Dialog>
    <HashSubpathProvider>
      {hash.url.pathname === "/connect" &&
        <Dialog>
          <h1 className="text-2xl font-medium">
            {Locale.get(Locale.Connection, locale)}
          </h1>
          <div className="h-4" />

        </Dialog>}
    </HashSubpathProvider>
    <h1 className="text-2xl font-medium">
      {Locale.get(Locale.Account, locale)}
    </h1>
    <div className="h-4" />
    <div className="font-medium">
      {Locale.get(Locale.Address, locale)}
    </div>
    <div className="h-2" />
    <div className="flex items-center border border-default-contrast rounded-xl po-2 gap-2">
      {account.address}
    </div>
    <div className="h-4" />
    <div className="font-medium">
      {Locale.get(Locale.PrivateKey, locale)}
    </div>
    <div className="h-2" />
    <div className="flex items-center border border-default-contrast rounded-xl po-2 gap-2"
      onClick={onRevealClick}>
      <div className="block w-full overflow-hidden whitespace-nowrap text-ellipsis">
        {reveal === true
          ? privateKey
          : "•".repeat(privateKey.length)}
      </div>
    </div>
    <div className="h-8 grow" />
    <div className="flex items-center flex-wrap-reverse gap-2">
      <WideClickableOppositeAnchor
        onKeyDown={connect.onKeyDown}
        onClick={connect.onClick}
        href={connect.href}>
        <Outline.WalletIcon className="size-5" />
        {Locale.get(Locale.UseAnotherWallet, locale)}
      </WideClickableOppositeAnchor>
    </div>
  </Dialog>
}