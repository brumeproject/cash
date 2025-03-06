import { Localizer } from "@/mods/locale/mods/context";
import { Page } from "@/mods/page";

export default function Home() {
  return <Localizer value={undefined}>
    <Page />
  </Localizer>
}
