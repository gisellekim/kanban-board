import { ColumnContainer, ColumnTitle } from "./styles"
import { Card } from "./Card"
import { AddNewItem } from "./AddNewItem"
import { useAppState } from "./state/AppStateContext"
import { addTask, moveList, moveTask, setDraggedItem } from "./state/actions"
import { useRef } from "react"
import { useItemDrag } from "./utils/useItemDrag"
import { throttle } from "throttle-debounce-ts"
import { useDrop } from "react-dnd"
import { isHidden } from "./utils/isHidden"

type ColumnProps = {
  id: string
  text: string
  isPreview?: boolean
}

export const Column = ({ id, text, isPreview }: ColumnProps) => {
  const { draggedItem, getTasksByListId, dispatch } = useAppState()
  const tasks = getTasksByListId(id)
  const ref = useRef<HTMLDivElement>(null)
  const { drag } = useItemDrag({ type: "COLUMN", id, text })
  const [, drop] = useDrop({
    accept: ["COLUMN", "CARD"],
    hover: throttle(200, () => {
      if (!draggedItem) {
        return
      }
      if (draggedItem.type === "COLUMN") {
        if (draggedItem.id === id) {
          return
        }
        dispatch(moveList(draggedItem.id, id))
      } else {
        if (draggedItem.columnId === id || tasks.length) {
          return
        }
        dispatch(moveTask(draggedItem.id, null, draggedItem.columnId, id))
        dispatch(setDraggedItem({ ...draggedItem, columnId: id }))
      }
    }),
  })
  drag(drop(ref))

  return (
    <ColumnContainer
      ref={ref}
      isPreview={isPreview}
      isHidden={isHidden(draggedItem, "COLUMN", id, isPreview)}
    >
      <ColumnTitle>{text}</ColumnTitle>
      {tasks.map((task) => (
        <Card key={task.id} id={task.id} text={task.text} columnId={id} />
      ))}
      <AddNewItem
        toggleButtonText="+ Add another card"
        onAdd={(text) => dispatch(addTask(text, id))}
        dark
      />
    </ColumnContainer>
  )
}
