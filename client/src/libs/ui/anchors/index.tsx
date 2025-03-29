import { Booleanish } from "@/libs/booleanish"
import { AnchorProps } from "@/libs/react/props/anchor"
import { ChildrenProps } from "@/libs/react/props/children"

export function TextAnchor(props: AnchorProps & { "aria-disabled"?: Booleanish }) {
  const { href, children = href, target = "_blank", rel = "noreferrer", "aria-disabled": disabled = false, ...rest } = props

  return <a className="outline-none hover:underline focus-visible:underline aria-disabled:opacity-50 transition-opacity"
    aria-disabled={disabled}
    target={target}
    href={href}
    rel={rel}
    {...rest}>
    {children}
  </a>
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

export function ClickableContrastAnchor(props: ChildrenProps & AnchorProps & { "aria-disabled"?: Booleanish }) {
  const { children, "aria-disabled": disabled = false, ...rest } = props

  return <a className="group po-2 bg-default-contrast rounded-xl outline-none aria-[disabled=false]:hover:bg-default-double-contrast focus-visible:outline-default-contrast aria-disabled:opacity-50 transition-opacity"
    aria-disabled={disabled}
    {...rest}>
    <GapperAndClickerInAnchorDiv>
      {children}
    </GapperAndClickerInAnchorDiv>
  </a>
}

export function WideClickableOppositeAnchor(props: ChildrenProps & AnchorProps & { "aria-disabled"?: Booleanish }) {
  const { children, "aria-disabled": disabled = false, ...rest } = props

  return <a className="flex-1 group po-2 bg-opposite border border-opposite text-opposite rounded-xl outline-none whitespace-nowrap aria-[disabled=false]:hover:bg-opposite-double-contrast focus-visible:outline-default-contrast aria-disabled:opacity-50 transition-opacity"
    aria-disabled={disabled}
    {...rest}>
    <GapperAndClickerInAnchorDiv>
      {children}
    </GapperAndClickerInAnchorDiv>
  </a>
}

export function GapperAndClickerInAnchorDiv(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex justify-center items-center gap-2 group-aria-[disabled=false]:group-active:scale-90 transition-transform">
    {children}
  </div>
}