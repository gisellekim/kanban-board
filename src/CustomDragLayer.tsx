import { useDragLayer } from "react-dnd"
import { useAppState } from "./state/AppStateContext"
import { CustomDragLayerContainer, DragLayerPreviewWrapper } from "./styles"
import { Column } from "./Column"

export const CustomDragLayer = () => {
  const { draggedItem } = useAppState()
  const { currentOffset } = useDragLayer((monitor) => ({
    currentOffset: monitor.getSourceClientOffset(),
  }))
  return draggedItem && currentOffset ? (
    <CustomDragLayerContainer>
      <DragLayerPreviewWrapper position={currentOffset}>
        <Column id={draggedItem.id} text={draggedItem.text} isPreview />
      </DragLayerPreviewWrapper>
    </CustomDragLayerContainer>
  ) : null
}
