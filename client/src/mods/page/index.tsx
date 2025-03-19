import { AnchorChip } from "@/libs/ui/anchors";
import { Ascii } from "@/mods/ascii";
import { useLocaleContext } from "@/mods/locale/mods/context";
import { NetWorker } from "@hazae41/networker";
import Head from "next/head";
import { useCallback, useEffect } from "react";
import { bytesToHex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(generatePrivateKey())

const contractZeroHex = "0xabc755011B810fDC31F3504f0F855cadFcb2685A".toLowerCase()
const receiverZeroHex = account.address.toLowerCase()

export function Page() {
  const locale = useLocaleContext().getOrThrow()

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

    const response = await fetch("http://localhost:3001/api/claim", { method: "POST", headers, body })

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
        <div className="h-[max(24rem,100dvh_-_16rem)] flex flex-col justify-center items-center">
          <div className="text-default-contrast whitespace-pre-wrap font-[monospace] text-[min(1vw,8px)] leading-[min(1vw,8px)]"
            dir="ltr">
            {closed ? Ascii.closed : Ascii.normal}
          </div>
        </div>
        <div className="h-16 grow shrink-0" />
        <div className="font-medium text-6xl">
          Cash
        </div>
        <div className="h-2 shrink-0" />
        <div className="text-default-contrast text-2xl">
          PoW-based peer-to-peer payment system
        </div>
        <div className="h-4 shrink-0" />
        <div className="flex flex-wrap gap-2">
          <AnchorChip
            href="https://wallet.brume.money"
            rel="noreferrer"
            target="_blank"
            dir="ltr">
            Wallet
          </AnchorChip>
          <AnchorChip
            href="https://dexscreener.com/ethereum/0xD0EbFe04Adb5Ef449Ec5874e450810501DC53ED5"
            rel="noreferrer"
            target="_blank"
            dir="ltr">
            $BRUME
          </AnchorChip>
          <AnchorChip
            href="https://x.com/BrumeProject"
            rel="noreferrer"
            target="_blank"
            dir="ltr">
            X.com
          </AnchorChip>
          <AnchorChip
            href="https://discord.gg/KVEPWfN9jK"
            rel="noreferrer"
            target="_blank"
            dir="ltr">
            Discord
          </AnchorChip>
          <AnchorChip
            href="https://juicebox.money/v2/p/748?tabid=about"
            rel="noreferrer"
            target="_blank"
            dir="ltr">
            Juicebox
          </AnchorChip>
          <AnchorChip
            href="https://github.com/brumeproject"
            rel="noreferrer"
            target="_blank"
            dir="ltr">
            GitHub
          </AnchorChip>
          <AnchorChip
            href="https://www.tldraw.com/s/v2_c_WZN9Q33cGQyF_RdbXqLUt"
            rel="noreferrer"
            target="_blank"
            dir="ltr">
            Tldraw
          </AnchorChip>
        </div>
      </div>
    </div>
  </div>
}
