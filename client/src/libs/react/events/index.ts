import { SyntheticEvent } from "react"

export namespace Events {

  export function keep(e: SyntheticEvent<HTMLElement>) {
    e.stopPropagation()
  }

  export function noop(e: SyntheticEvent<HTMLElement>) {
    e.preventDefault()
  }

  export function cancel(e: SyntheticEvent<HTMLElement>) {
    e.preventDefault()
    e.stopPropagation()
  }

}