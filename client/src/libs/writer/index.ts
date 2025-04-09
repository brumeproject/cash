import { useCallback, useEffect, useState } from "react"
import { Errors, NotAnError } from "../errors"

async function wait(delay: number) {
  await new Promise(ok => setTimeout(ok, delay))
}

export async function* write(list: string[], signal: AbortSignal) {
  for (let i = 0; true; i = (i + 1) % list.length) {
    const prev = list[i % list.length]
    const next = list[(i + 1) % list.length]

    for (let j = 0; j < prev.length && !signal.aborted; j++) {
      if (next[j] === prev[j])
        continue

      for (; j < prev.length && !signal.aborted; j++) {
        yield (text: string) => text.slice(0, -1)

        await wait(150)
      }; signal.throwIfAborted()
    }; signal.throwIfAborted()

    for (let j = 0; j < next.length && !signal.aborted; j++) {
      if (next[j] === prev[j])
        continue

      for (; j < next.length && !signal.aborted; j++) {
        yield (text: string) => text + next[j]

        await wait(150)
      }; signal.throwIfAborted()
    }; signal.throwIfAborted()

    await wait(3000)
  }
}

export function useWriter(list: string[]) {
  const [output, setOutput] = useState(list[0])

  useEffect(() => {
    setOutput(list[0])
  }, [list])

  const writeAndOutput = useCallback(async (signal: AbortSignal) => {
    for await (const action of write(list, signal)) setOutput(action)
  }, [list])

  useEffect(() => {
    const aborter = new AbortController()
    writeAndOutput(aborter.signal).catch(Errors.log)
    return () => void aborter.abort(new NotAnError())
  }, [writeAndOutput])

  return output
}