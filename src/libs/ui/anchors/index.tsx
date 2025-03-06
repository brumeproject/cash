import { Booleanish } from "@/libs/booleanish"
import { AnchorProps } from "@/libs/react/props/anchor"
import { ChildrenProps } from "@/libs/react/props/children"

export function AnchorGapperAndClicker(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex justify-center items-center gap-2 group-aria-[disabled=false]:group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function AnchorChip(props: ChildrenProps & AnchorProps & { "aria-disabled"?: Booleanish }) {
  const { children, "aria-disabled": disabled = false, ...rest } = props

  return <a className="group rounded-full po-2 bg-default-contrast outline-none aria-[disabled=false]:hover:bg-default-double-contrast focus-visible:outline-contrast aria-disabled:opacity-50 transition-opacity"
    aria-disabled={disabled}
    {...rest}>
    <AnchorGapperAndClicker>
      {children}
    </AnchorGapperAndClicker>
  </a>
}