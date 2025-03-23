import { Events } from "@/libs/react/events"
import { ChildrenProps } from "@/libs/react/props/children"
import { createPortal } from "react-dom"

export function Portal(props: ChildrenProps) {
  const { children } = props

  const container = document.getElementById("root")

  if (container == null)
    return null

  return createPortal(<Keeper>
    {children}
  </Keeper>, container)
}

export function Keeper(props: ChildrenProps) {
  const { children } = props

  return <div
    onClick={Events.keep}
    onContextMenu={Events.keep}
    onDoubleClick={Events.keep}

    onDrag={Events.keep}
    onDragEnd={Events.keep}
    onDragEnter={Events.keep}
    onDragExit={Events.keep}
    onDragLeave={Events.keep}
    onDragOver={Events.keep}
    onDragStart={Events.keep}
    onDrop={Events.keep}

    onMouseDown={Events.keep}
    onMouseEnter={Events.keep}
    onMouseLeave={Events.keep}
    onMouseMove={Events.keep}
    onMouseOver={Events.keep}
    onMouseOut={Events.keep}
    onMouseUp={Events.keep}

    onKeyDown={Events.keep}
    onKeyUp={Events.keep}

    onFocus={Events.keep}
    onBlur={Events.keep}

    onChange={Events.keep}
    onInput={Events.keep}

    onInvalid={Events.keep}
    onSubmit={Events.keep}>
    {children}
  </div>
}