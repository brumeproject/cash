import { EffectCallback, useCallback, useEffect, useRef, useState } from "react"

async function wait(delay: number) {
  await new Promise(ok => setTimeout(ok, delay))
}

export async function* write(list: string[]) {
  for (let i = 0; true; i = (i + 1) % list.length) {
    const prev = list[i % list.length]
    const next = list[(i + 1) % list.length]

    for (let j = 0; j < prev.length; j++) {
      if (next[j] === prev[j])
        continue

      for (; j < prev.length; j++) {
        yield (text: string) => text.slice(0, -1)

        await wait(150)
      }
    }

    for (let j = 0; j < next.length; j++) {
      if (next[j] === prev[j])
        continue

      for (; j < next.length; j++) {
        yield (text: string) => text + next[j]

        await wait(150)
      }
    }

    await wait(3000)
  }
}

function useOnce(effect: EffectCallback) {
  const once = useRef(false)

  useEffect(() => {
    if (once.current)
      return
    once.current = true

    return effect()
  }, [])
}

export function useWriter(list: string[]) {
  const [output, setOutput] = useState(list[0])

  const writeAndOutput = useCallback(async () => {
    for await (const action of write(list)) setOutput(action)
  }, [])

  useOnce(() => void writeAndOutput().catch(console.error))

  return output
}