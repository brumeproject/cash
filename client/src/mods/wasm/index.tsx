import { Errors } from "@/libs/errors";
import { ChildrenProps } from "@/libs/react/props/children";
import { CashServerWasm } from "@brumewallet/cash.server.wasm";
import { Base16, Keccak256 } from "@hazae41/cubane";
import { Secp256k1 } from "@hazae41/secp256k1";
import { useCallback, useEffect, useState } from "react";

export function WasmProvider(props: ChildrenProps) {
  const { children } = props

  const [loaded, setLoaded] = useState(false)

  const loadOrThrow = useCallback(async () => {
    await CashServerWasm.initBundled()

    Keccak256.set(Keccak256.fromWasm(CashServerWasm))
    Secp256k1.set(Secp256k1.fromWasm(CashServerWasm))

    Base16.set(Base16.fromWasm(CashServerWasm))

    setLoaded(true)
  }, [])

  useEffect(() => {
    loadOrThrow().catch(Errors.logAndAlert)
  }, [])

  if (!loaded)
    return null

  return <>{children}</>
}