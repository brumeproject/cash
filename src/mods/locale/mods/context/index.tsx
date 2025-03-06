import { ChildrenProps } from "@/libs/react/props/children";
import { ValueProps } from "@/libs/react/props/value";
import { Nullable, Option } from "@hazae41/option";
import { createContext, useContext, useMemo } from "react";
import { Locale } from "../..";

export const LocaleContext = createContext<Nullable<string>>(undefined)

export function useLocaleContext() {
  return Option.wrap(useContext(LocaleContext))
}

export function Localizer(props: ValueProps<Nullable<string>> & ChildrenProps) {
  const { value, children } = props

  const browser = useMemo(() => {
    return navigator.language.split("-")[0]
  }, [])

  const locale = useMemo(() => {
    return value || browser
  }, [value, browser])

  const direction = useMemo(() => {
    return Locale.get(Locale.direction, locale)
  }, [locale])

  return <LocaleContext value={locale}>
    <div className="h-full w-full overflow-hidden"
      dir={direction}>
      {children}
    </div>
  </LocaleContext>
}