import { useMappingStore } from "@src/stores"
import { EventMode } from "@src/types"
import ActionComponent from "./Action"

interface KeyProps {
    keyId: string
  }

const Key: React.FC<KeyProps> = ({ keyId }) => {
    const getButtonAction = useMappingStore((store) => store.getButtonAction)

    const action = getButtonAction(keyId, EventMode.KeyDown)

    return (
        <ActionComponent action={action} />
    )
}

export default Key