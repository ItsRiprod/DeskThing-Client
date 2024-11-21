import { useMappingStore } from "@src/stores"
import { Action } from "@src/types"

interface ActionProps {
    action: Action
  }

const ActionComponent: React.FC<ActionProps> = ({ action }) => {
    const executeAction = useMappingStore((store) => store.executeAction)
    const getActionUrl = useMappingStore((store) => store.getActionUrl)

    const onClick = () => {
        executeAction(action)
    }

    const actionUrl = action && getActionUrl(action)

    return (
        <button className="w-full h-full cursor-pointer" onClick={onClick}> 
            <img src={actionUrl} className="text-blue-500 w-full h-full [&>path]:stroke-current [&>rect]:stroke-current" alt={action.name || action.id} />
        </button>
    )
}

export default ActionComponent