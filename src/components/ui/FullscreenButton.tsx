import Button from "./Button"
import { ActionReference } from "@src/types"
import { useMappingStore } from "@src/stores"
import ActionIcon from "./ActionIcon"

const FullscreenAction: ActionReference = {
    id: 'fullscreen',
    source: 'server',
    enabled: true

}

interface FullscreenButtonProps {
    expanded?: boolean
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({ expanded }) => {
    const executeAction = useMappingStore((state) => state.executeAction)
    const getActionUrl = useMappingStore((state) => state.getActionUrl)

    const onClick = () => {
        executeAction(FullscreenAction)
    }

    
    

    return (
        <Button className="w-fit border-2 border-cyan-500 items-center" onClick={onClick}>
            <p className={`${expanded ? 'w-fit' : 'w-0'} text-nowrap text-2xl font-semibold mx-2 overflow-hidden transition-[width]`}>
                Toggle Fullscreen
            </p>
            <div className={`flex items-center justify-center cursor-pointer`}> 
                <ActionIcon url={getActionUrl(FullscreenAction)} />
            </div>
        </Button>
    )
}

export default FullscreenButton