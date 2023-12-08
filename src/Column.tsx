import { ColumnContainer, ColumnTitle } from "./styles"
import { Card } from "./Card"
import { AddNewItem } from "./AddNewItem"
import { useAppState } from "./state/AppStateContext"
import { addTask, moveList } from "./state/actions"
import { useRef } from "react"
import { useItemDrag } from "./utils/useItemDrag"
import { throttle } from "throttle-debounce-ts"
import { useDrop } from "react-dnd"
import { isHidden } from "./utils/isHidden"

type ColumnProps = {
  id: string
  text: string
}

export const Column = ({ id, text }: ColumnProps) => {
  const { draggedItem, getTasksByListId, dispatch } = useAppState()
  const tasks = getTasksByListId(id)
  const ref = useRef<HTMLDivElement>(null)
  const { drag } = useItemDrag({ type: "COLUMN", id, text })
  const [, drop] = useDrop({
    accept: "COLUMN",
    hover: throttle(200, () => {
      if (!draggedItem) {
        return
      }
      if (draggedItem.type === "COLUMN") {
        if (draggedItem.id === id) {
          return
        }
        dispatch(moveList(draggedItem.id, id))
      }
    }),
  })
  drag(drop(ref))

  return (
    <ColumnContainer ref={ref} isHidden={isHidden(draggedItem, "COLUMN", id)}>
      <ColumnTitle>{text}</ColumnTitle>
      {tasks.map((task) => (
        <Card key={task.id} id={task.id} text={task.text} />
      ))}
      <AddNewItem
        toggleButtonText="+ Add another card"
        onAdd={(text) => dispatch(addTask(text, id))}
        dark
      />
    </ColumnContainer>
  )
}
