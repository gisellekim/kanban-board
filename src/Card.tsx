import { useRef } from "react"
import { useAppState } from "./state/AppStateContext"
import { CardContainer } from "./styles"
import { isHidden } from "./utils/isHidden"
import { useItemDrag } from "./utils/useItemDrag"
import { useDrop } from "react-dnd"
import { throttle } from "throttle-debounce-ts"
import { moveTask, setDraggedItem } from "./state/actions"

type CardProps = {
  id: string
  text: string
  columnId: string
  isPreview?: boolean
}

export const Card = ({ id, text, columnId, isPreview }: CardProps) => {
  const { draggedItem, dispatch } = useAppState()
  const ref = useRef<HTMLDivElement>(null)
  const { drag } = useItemDrag({ type: "CARD", id, text, columnId })

  const [, drop] = useDrop({
    accept: "CARD",
    hover: throttle(200, () => {
      if (
        !draggedItem ||
        draggedItem.id === id ||
        draggedItem.type !== "CARD"
      ) {
        return
      }
      dispatch(moveTask(draggedItem.id, id, draggedItem.columnId, columnId))
      dispatch(setDraggedItem({ ...draggedItem, columnId }))
    }),
  })
  drag(drop(ref))

  return (
    <CardContainer
      ref={ref}
      isPreview={isPreview}
      isHidden={isHidden(draggedItem, "CARD", id, isPreview)}
    >
      {text}
    </CardContainer>
  )
}
