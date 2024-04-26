'use client'
import { useGenerationContext } from "@/context/generation-context";
import { Switch } from "@nextui-org/react"


const AdvancedIndicator: React.FC = () => {
    const { isAdvancedView, setIsAdvancedView } = useGenerationContext()
    return (
        <>
            <Switch defaultSelected={isAdvancedView} aria-label="Advanced View" onValueChange={setIsAdvancedView}>dev-adv-settings</Switch>
        </>
    );
};

export default AdvancedIndicator