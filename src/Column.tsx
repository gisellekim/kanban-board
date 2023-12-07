import { ColumnContainer, ColumnTitle } from "./styles"
import { Card } from "./Card"
import { AddNewItem } from "./AddNewItem"
import { useAppState } from "./state/AppStateContext"

type ColumnProps = {
  id: string
  text: string
}

export const Column = ({ id, text }: ColumnProps) => {
  const { getTasksByListId } = useAppState()

  const tasks = getTasksByListId(id)
  return (
    <ColumnContainer>
      <ColumnTitle>{text}</ColumnTitle>
      {tasks.map((task) => (
        <Card key={task.id} id={task.id} text={task.text} />
      ))}
      <AddNewItem
        toggleButtonText="+ Add another card"
        onAdd={console.log}
        dark
      />
    </ColumnContainer>
  )
}
