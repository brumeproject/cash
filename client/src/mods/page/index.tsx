import { NetWorker } from "@hazae41/networker";
import Head from "next/head";
import { useCallback, useEffect } from "react";
import { bytesToHex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(generatePrivateKey())

const contractZeroHex = "0xabc755011B810fDC31F3504f0F855cadFcb2685A".toLowerCase()
const receiverZeroHex = account.address.toLowerCase()

export function Page() {
  const f = useCallback(async () => {
    using worker = new NetWorker()

    const nonceBytes = crypto.getRandomValues(new Uint8Array(32))
    const nonceZeroHex = bytesToHex(nonceBytes)

    await using mixin = await worker.createOrThrow({ contractZeroHex, receiverZeroHex, nonceZeroHex })

    const minimumBigInt = BigInt(100000)
    const minimumZeroHex = `0x${minimumBigInt.toString(16)}`

    const result0 = await mixin.generateOrThrow(minimumZeroHex)
    const result1 = await mixin.generateOrThrow(minimumZeroHex)
    const result2 = await mixin.generateOrThrow(minimumZeroHex)

    const secretsZeroHex = `0x${result0.secretZeroHex.slice(2)}${result1.secretZeroHex.slice(2)}${result2.secretZeroHex.slice(2)}`
    const signatureZeroHex = await account.signMessage({ message: nonceZeroHex })

    const headers = { "Content-Type": "application/json" }
    const body = JSON.stringify({ nonceZeroHex, secretsZeroHex, signatureZeroHex })

    const response = await fetch("https://api.cash.brume.money/api/claim", { method: "POST", headers, body })

    if (!response.ok)
      throw new Error("Claim failed")

    const valueZeroHex = await response.json()
    const valueBigInt = BigInt(valueZeroHex)

    console.log(valueBigInt)
  }, [])

  useEffect(() => {
    f().catch(e => console.error({ e }))
  }, [])

  return <div className="p-safe h-full w-full flex flex-col overflow-y-scroll animate-opacity-in">
    <Head>
      <title>Brume Cash</title>
    </Head>
    <div className="grow flex flex-col w-full m-auto max-w-6xl">
      <div className="h-[100dvh] flex flex-col p-8">
        <div className="font-medium text-6xl">
          Monetize anything on the web
        </div>
        <div className="h-2 shrink-0" />
        <div className="text-default-contrast text-2xl">
          Make your users pay anonymously with their computation
        </div>
      </div>
    </div>
  </div>
}
