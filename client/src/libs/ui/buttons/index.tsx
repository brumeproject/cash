import { ButtonProps } from "@/libs/react/props/button"
import { ChildrenProps } from "@/libs/react/props/children"

export function GapperAndClickerInButtonDiv(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex justify-center items-center gap-2 group-enabled:group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function ClickableOppositeButton(props: ChildrenProps & ButtonProps) {
  const { children, ...rest } = props

  return <button className="group po-2 bg-opposite text-opposite rounded-xl outline-none enabled:hover:bg-opposite-double-contrast focus-visible:outline-opposite disabled:opacity-50 transition-opacity"
    {...rest}>
    <GapperAndClickerInButtonDiv>
      {children}
    </GapperAndClickerInButtonDiv>
  </button>
}
