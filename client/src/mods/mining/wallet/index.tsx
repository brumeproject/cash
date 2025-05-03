import { Errors, UIError } from "@/libs/errors";
import { Nullable } from "@/libs/nullable";
import { ChildrenProps } from "@/libs/react/props/children";
import { WideClickableContrastButton } from "@/libs/ui/buttons";
import { Dialog } from "@/libs/ui/dialog";
import { API } from "@/mods/api";
import { useDatabaseContext } from "@/mods/database";
import { HashSubpathProvider, useHashSubpath, usePathContext } from "@hazae41/chemin";
import { ExtSigningKey, ZeroHexSignature, ZeroHexSigner, ZeroHexSigningKey } from "@hazae41/cubane";
import { Fixed } from "@hazae41/fixed";
import { ZeroHexString } from "@hazae41/hex";
import { Option } from "@hazae41/option";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Locale } from "../../locale";
import { useLocaleContext } from "../../locale/mods/context";

export interface WalletHandle {
  readonly current: ZeroHexSigner

  setOrThrow(signer: ZeroHexSigner): Promise<void>
}

export const WalletContext = createContext<Nullable<WalletHandle>>(undefined)

export function useWalletContext() {
  return Option.wrap(useContext(WalletContext))
}

export function WalletProvider(props: ChildrenProps) {
  const { children } = props
  const database = useDatabaseContext().getOrThrow()

  const [current, setCurrent] = useState<ZeroHexSigner>()

  const getAndSetAccountOrLogAndAlert = useCallback(() => Errors.runOrLogAndAlert(async () => {
    const stale = await database.getOrThrow<ZeroHexSigningKey>("account")

    if (stale != null) {
      const signer = ZeroHexSigner.fromOrThrow(stale)

      setCurrent(signer)

      return
    }

    const fresh = ExtSigningKey.randomOrThrow()
    const signer = ZeroHexSigner.fromOrThrow(fresh)

    await database.setOrThrow("account", signer.signingKey)

    setCurrent(signer)
  }), [database])

  useEffect(() => {
    if (database == null)
      return
    getAndSetAccountOrLogAndAlert()
  }, [database, getAndSetAccountOrLogAndAlert])

  const setOrThrow = useCallback(async (signer: ZeroHexSigner) => {
    if (database == null)
      return

    await database.setOrThrow("account", signer.signingKey)

    setCurrent(signer)
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
    await wallet.setOrThrow(ZeroHexSigner.fromOrThrow(ExtSigningKey.randomOrThrow()))
  }), [wallet])

  const onImportClick = useCallback(() => Errors.runOrLogAndAlert(async () => {
    const privateKey = prompt("Enter your private key")

    if (privateKey == null)
      return

    if (!ZeroHexString.Length.is(privateKey, 32))
      throw new UIError("Invalid private key")

    await wallet.setOrThrow(ZeroHexSigner.fromOrThrow(privateKey))
  }), [wallet])

  const [account, setAccount] = useState<{ balance: string, nonce: string }>()

  const getAndSetAccountOrLogAndAlert = useCallback(() => Errors.runOrLogAndAlert(async () => {
    const response = await fetch(new URL(`/api/v0/account?address=${wallet.current.address.toLowerCase()}`, API))

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

    if (!ZeroHexString.Length.is($receiver, 20))
      throw new UIError("Invalid address")

    const $value = prompt("Enter the amount to send")

    if ($value == null)
      return

    const receiver = $receiver.toLowerCase()
    const value = Fixed.fromDecimalString($value).as(18).toBigInt().toString()
    const data = { receiver, value }

    const version = "422827093349"
    const type = "transfer"
    const nonce = account.nonce

    const message = JSON.stringify({ version, type, nonce, data })
    const signature = ZeroHexSignature.fromExtOrThrow(wallet.current.signMessageNoOffsetOrThrow(message))

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
        {wallet.current.address}
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
          ? wallet.current.signingKey
          : "•".repeat(wallet.current.signingKey.length)}
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