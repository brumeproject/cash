import { Outline } from "@/libs/heroicons";
import { ClickableOppositeButton } from "@/libs/ui/buttons";
import { Loading } from "@/libs/ui/loading";
import { NetWorker } from "@hazae41/networker";
import Head from "next/head";
import { useCallback, useState } from "react";
import { bytesToHex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(generatePrivateKey())

const contractZeroHex = "0xabc755011B810fDC31F3504f0F855cadFcb2685A".toLowerCase()
const receiverZeroHex = account.address.toLowerCase()

export function Page() {
  const [loading, setLoading] = useState(false)

  const f = useCallback(async () => {
    try {
      setLoading(true)

      using worker = new NetWorker()

      const nonceBytes = crypto.getRandomValues(new Uint8Array(32))
      const nonceZeroHex = bytesToHex(nonceBytes)

      await using mixin = await worker.createOrThrow({ contractZeroHex, receiverZeroHex, nonceZeroHex })

      const minimumBigInt = BigInt(100000)
      const minimumZeroHex = `0x${minimumBigInt.toString(16)}`

      const generated = await mixin.generateOrThrow(minimumZeroHex)

      const secretsZeroHex = `0x${generated.secretZeroHex.slice(2)}`
      const signatureZeroHex = await account.signMessage({ message: nonceZeroHex })

      const headers = { "Content-Type": "application/json" }
      const body = JSON.stringify({ nonceZeroHex, secretsZeroHex, signatureZeroHex })

      const response = await fetch("https://api.cash.brume.money/api/claim", { method: "POST", headers, body })

      if (!response.ok)
        throw new Error("Claim failed")

      const valueZeroHex = await response.json()
      const valueBigInt = BigInt(valueZeroHex)

      alert(`You just mined and sent ${valueBigInt.toString()} wei to ${receiverZeroHex}`)
    } finally {
      setLoading(false)
    }
  }, [])

  return <div className="p-safe h-full w-full flex flex-col overflow-y-scroll animate-opacity-in">
    <Head>
      <title>Brume Cash</title>
    </Head>
    <div className="h-[max(24rem,100dvh_-_16rem)] flex-none flex flex-col items-center">
      <div className="grow" />
      <h1 className="text-center text-6xl font-medium">
        {`Monetize anything on the web`}
      </h1>
      <div className="h-4" />
      <div className="text-center text-default-contrast text-2xl">
        {`Make your users pay anonymously with their computation`}
      </div>
      <div className="grow" />
      <div className="flex items-center">
        <ClickableOppositeButton
          disabled={loading}
          onClick={f}>
          {loading
            ? <Loading className="size-5" />
            : <Outline.BoltIcon className="size-5" />}
          {`Start`}
        </ClickableOppositeButton>
      </div>
      <div className="grow" />
      <div className="grow" />
    </div>
  </div>
}
