import { Errors, UIError } from "@/libs/errors";
import { Nullable } from "@/libs/nullable";
import { ChildrenProps } from "@/libs/react/props/children";
import { WideClickableContrastButton } from "@/libs/ui/buttons";
import { Dialog } from "@/libs/ui/dialog";
import { API } from "@/mods/api";
import { useDatabaseContext } from "@/mods/database";
import { HashSubpathProvider, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { Address } from "@hazae41/cubane";
import { Fixed } from "@hazae41/fixed";
import { Option } from "@hazae41/option";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Hex, isAddress, PrivateKeyAccount } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { Locale } from "../../locale";
import { useLocaleContext } from "../../locale/mods/context";

export interface WalletInfo {
  readonly privateKey: Hex

  readonly viemAccount: PrivateKeyAccount
}

export interface WalletHandle {
  readonly current: WalletInfo

  setOrThrow(privateKey: Hex): Promise<void>
}

export const WalletContext = createContext<Nullable<WalletHandle>>(undefined)

export function useWalletContext() {
  return Option.wrap(useContext(WalletContext))
}

export function WalletProvider(props: ChildrenProps) {
  const { children } = props
  const database = useDatabaseContext().getOrThrow()

  const [current, setCurrent] = useState<WalletInfo>()

  const getAndSetAccountOrLogAndAlert = useCallback(() => Errors.runOrLogAndAlert(async () => {
    const stalePrivateKey = await database.getOrThrow<Hex>("account")

    if (stalePrivateKey != null) {
      const viemAccount = privateKeyToAccount(stalePrivateKey)
      const privateKey = stalePrivateKey

      return void setCurrent({ viemAccount, privateKey })
    }

    const freshPrivateKey = generatePrivateKey()

    await database.setOrThrow("account", freshPrivateKey)

    const privateKey = freshPrivateKey
    const viemAccount = privateKeyToAccount(privateKey)

    setCurrent({ viemAccount, privateKey })
  }), [database])

  useEffect(() => {
    if (database == null)
      return
    getAndSetAccountOrLogAndAlert()
  }, [database, getAndSetAccountOrLogAndAlert])

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

  return <WalletContext.Provider value={handle}>
    {children}
  </WalletContext.Provider>
}

export function WalletDialog() {
  const path = usePathContext().getOrThrow()
  const locale = useLocaleContext().getOrThrow()
  const wallet = useWalletContext().getOrThrow()

  const hash = useHashSubpath(path)

  const [reveal, setReveal] = useState(false)

  const onRevealClick = useCallback(() => Errors.runOrLogAndAlert(async () => {
    setReveal(true)
  }), [])

  const onGenerateClick = useCallback(() => Errors.runOrLogAndAlert(async () => {
    await wallet.setOrThrow(generatePrivateKey())
  }), [wallet])

  const onImportClick = useCallback(() => Errors.runOrLogAndAlert(async () => {
    const privateKey = prompt("Enter your private key")

    if (privateKey == null)
      return

    await wallet.setOrThrow(privateKey as Hex)
  }), [wallet])

  const [account, setAccount] = useState<{ balance: string, nonce: string }>()

  const getAndSetAccountOrLogAndAlert = useCallback(() => Errors.runOrLogAndAlert(async () => {
    const response = await fetch(new URL(`/api/v0/account?address=${wallet.current.viemAccount.address.toLowerCase()}`, API))

    if (!response.ok)
      throw new Error("Failed to fetch balance")

    setAccount(await response.json())
  }), [wallet])

  useEffect(() => {
    getAndSetAccountOrLogAndAlert()
  }, [getAndSetAccountOrLogAndAlert])

  const onSendClick = useCallback(() => Errors.runOrLogAndAlert(async () => {
    if (account == null)
      return

    const $receiver = prompt("Enter the address to send to")

    if ($receiver == null)
      return
    if (!isAddress($receiver))
      throw new UIError("Invalid address")

    const $value = prompt("Enter the amount to send")

    if ($value == null)
      return

    const receiver = Address.fromOrThrow($receiver).toLowerCase()
    const value = Fixed.fromDecimalString($value).as(18).toBigInt().toString()

    const version = "422827093349"
    const type = "transfer"
    const nonce = account.nonce
    const data = { receiver, value }

    const message = JSON.stringify({ version, type, nonce, data })
    const signature = await wallet.current.viemAccount.signMessage({ message })

    const headers = { "Content-Type": "application/json" }
    const body = JSON.stringify({ version, type, nonce, receiver, value, signature })

    const response = await fetch(new URL("/api/v0/transfer", API), { method: "POST", headers, body })

    if (!response.ok)
      throw new UIError("Could not claim")

    alert("Transfer successful")

    getAndSetAccountOrLogAndAlert()
  }), [wallet, account])

  const balance = useMemo(() => {
    if (account == null)
      return
    return Fixed.fromBigInt(BigInt(account.balance)).as(18).toDecimalString()
  }, [account])

  return <>
    <HashSubpathProvider>
      {hash.url.pathname === "/connect" &&
        <Dialog>
          <h1 className="text-2xl font-medium">
            {Locale.get(Locale.Connection, locale)}
          </h1>
          <div className="h-4" />
          <div className="flex items-center flex-wrap-reverse gap-2">
            <WideClickableContrastButton>
              Generate a new wallet
            </WideClickableContrastButton>
            <WideClickableContrastButton>
              Import an existing wallet
            </WideClickableContrastButton>
          </div>
        </Dialog>}
    </HashSubpathProvider>
    <h1 className="text-2xl font-medium">
      {Locale.get(Locale.Wallet, locale)}
    </h1>
    <div className="h-4" />
    <div className="font-medium">
      {Locale.get(Locale.Balance, locale)}
    </div>
    <div className="h-2" />
    <div className="flex items-center border border-default-contrast rounded-xl po-2 gap-2">
      <div className="block w-full overflow-hidden whitespace-nowrap text-ellipsis">
        {balance == null ? "..." : balance}
      </div>
    </div>
    <div className="h-2" />
    <div className="flex items-center flex-wrap-reverse gap-2">
      <WideClickableContrastButton
        onClick={onSendClick}>
        {Locale.get(Locale.Send, locale)}
      </WideClickableContrastButton>
    </div>
    <div className="h-4" />
    <div className="font-medium">
      {Locale.get(Locale.Address, locale)}
    </div>
    <div className="h-2" />
    <div className="flex items-center border border-default-contrast rounded-xl po-2 gap-2">
      <div className="block w-full overflow-hidden whitespace-nowrap text-ellipsis">
        {wallet.current.viemAccount.address}
      </div>
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
          ? wallet.current.privateKey
          : "•".repeat(wallet.current.privateKey.length)}
      </div>
    </div>
    <div className="h-2" />
    <div className="flex items-center flex-wrap-reverse gap-2">
      <WideClickableContrastButton
        onClick={onGenerateClick}>
        {Locale.get(Locale.GenerateANewWallet, locale)}
      </WideClickableContrastButton>
      <WideClickableContrastButton
        onClick={onImportClick}>
        {Locale.get(Locale.ImportAnExistingWallet, locale)}
      </WideClickableContrastButton>
    </div>
  </>
}