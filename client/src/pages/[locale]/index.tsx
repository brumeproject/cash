import { Locale } from "@/mods/locale"
import { Localizer } from "@/mods/locale/mods/context"
import { Page } from "@/mods/page"

export interface Params {
  readonly locale: string
}

export function getStaticPaths() {
  return {
    paths: Locale.codes.map(locale => ({ params: { locale } })),
    fallback: false
  }
}

export function getStaticProps(context: {
  readonly params: Params
}) {
  return { props: context.params }
}

export default function Main(props: Params) {
  const { locale } = props

  return <Localizer value={locale}>
    <Page />
  </Localizer>
}