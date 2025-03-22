import { Booleanish } from "@/libs/booleanish"
import { AnchorProps } from "@/libs/react/props/anchor"
import { ChildrenProps } from "@/libs/react/props/children"

export function GapperAndClickerInAnchorDiv(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex justify-center items-center gap-2 group-aria-[disabled=false]:group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function ClickableOppositeAnchor(props: ChildrenProps & AnchorProps & { "aria-disabled"?: Booleanish }) {
  const { children, "aria-disabled": disabled = false, ...rest } = props

  return <a className="group po-2 bg-opposite text-opposite rounded-xl outline-none aria-[disabled=false]:hover:bg-opposite-double-contrast focus-visible:outline-opposite aria-disabled:opacity-50 transition-opacity"
    aria-disabled={disabled}
    {...rest}>
    <GapperAndClickerInAnchorDiv>
      {children}
    </GapperAndClickerInAnchorDiv>
  </a>
}