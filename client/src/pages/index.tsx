import { Localizer } from "@/mods/locale/mods/context";
import { MiningPage } from "@/mods/mining/page";

export default function Home() {
  return <Localizer value={undefined}>
    <div id="root" className="p-safe h-full w-full flex flex-col overflow-y-scroll animate-opacity-in">
      <MiningPage />
    </div>
  </Localizer>
}
