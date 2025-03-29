import { Errors } from "@/libs/errors";
import { Nullable } from "@/libs/nullable";
import { ChildrenProps } from "@/libs/react/props/children";
import { WideClickableContrastButton } from "@/libs/ui/buttons";
import { Dialog } from "@/libs/ui/dialog";
import { HashSubpathProvider, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { Option } from "@hazae41/option";
import { Database } from "@hazae41/serac";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Hex, PrivateKeyAccount } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { Locale } from "../locale";
import { useLocaleContext } from "../locale/mods/context";

export interface AccountInfo {
  readonly privateKey: Hex

  readonly viemAccount: PrivateKeyAccount
}

export interface AccountHandle {
  readonly current: AccountInfo

  setOrThrow(privateKey: Hex): Promise<void>
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

  const [current, setCurrent] = useState<AccountInfo>()

  const getAndSetAccount = useCallback(async (database: Database) => {
    const stalePrivateKey = await database.getOrThrow<Hex>("account")

    if (stalePrivateKey != null) {
      const viemAccount = privateKeyToAccount(stalePrivateKey)
      const privateKey = stalePrivateKey

      return void setCurrent({ viemAccount, privateKey })
    }

    const freshPrivateKey = generatePrivateKey()

    database.setOrThrow("account", freshPrivateKey)

    const privateKey = freshPrivateKey
    const viemAccount = privateKeyToAccount(privateKey)

    setCurrent({ viemAccount, privateKey })
  }, [database])

  useEffect(() => {
    if (database == null)
      return
    getAndSetAccount(database).catch(Errors.logAndAlert)
  }, [database])

  const setOrThrow = useCallback(async (privateKey: Hex) => {
    if (database == null)
      return

    const viemAccount = privateKeyToAccount(privateKey)

    await database.setOrThrow("account", privateKey)

    setCurrent({ viemAccount, privateKey })
  }, [database])

  const handle = useMemo(() => {
    if (current == null)
      return
    return { current, setOrThrow }
  }, [current, setOrThrow])

  if (handle == null)
    return null

  return <AccountContext.Provider value={handle}>
    {children}
  </AccountContext.Provider>
}

export function WalletDialog() {
  const path = usePathContext().getOrThrow()
  const locale = useLocaleContext().getOrThrow()
  const account = useAccountContext().getOrThrow()

  const hash = useHashSubpath(path)

  const [reveal, setReveal] = useState(false)

  const onRevealClick = useCallback(() => Errors.runOrLogAndAlert(async () => {
    setReveal(true)
  }), [])

  const onGenerateClick = useCallback(() => Errors.runOrLogAndAlert(async () => {
    await account.setOrThrow(generatePrivateKey())
  }), [account])

  const onImportClick = useCallback(() => Errors.runOrLogAndAlert(async () => {
    const privateKey = prompt("Enter your private key")

    if (privateKey == null)
      return

    await account.setOrThrow(privateKey as Hex)
  }), [account])

  return <Dialog>
    <HashSubpathProvider>
      {hash.url.pathname === "/connect" &&
        <Dialog>
          <h1 className="text-2xl font-medium">
            {Locale.get(Locale.Connection, locale)}
          </h1>
          <div className="h-4" />
          <WideClickableContrastButton>
            Generate a new wallet
          </WideClickableContrastButton>
          <div className="h-2" />
          <WideClickableContrastButton>
            Import an existing wallet
          </WideClickableContrastButton>
          {/* <div className="h-2" />
          <WideClickableContrastButton>
            Derive a wallet from another wallet
          </WideClickableContrastButton> */}
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
      {account.current.viemAccount.address}
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
          ? account.current.privateKey
          : "•".repeat(account.current.privateKey.length)}
      </div>
    </div>
    <div className="h-8 grow" />
    <WideClickableContrastButton
      onClick={onGenerateClick}>
      {Locale.get(Locale.GenerateANewWallet, locale)}
    </WideClickableContrastButton>
    <div className="h-2" />
    <WideClickableContrastButton
      onClick={onImportClick}>
      Import an existing wallet
    </WideClickableContrastButton>
  </Dialog>
}