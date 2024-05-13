import { Utils } from "@/libs/utils"
import { useEffect, useState } from "react"

interface PollingIndicatorProps {
    interval: number,
    maxWaitMS: number,
    pollAndShouldRetry: () => Promise<boolean>
}

const PollingIndicator: React.FC<PollingIndicatorProps> = (props: PollingIndicatorProps) => {
    const [pollingStatus, setPollingStatus] = useState<string>('')

    const poll = async () => {
        setPollingStatus('🟢 Magic starts...')
        const t = new Date().getTime()
        while (true) {
            await Utils.delay(props.interval)
            setPollingStatus(`🟢 Please stay in the app as we fantasize`)
            const shouldRetry = await props.pollAndShouldRetry()
            if (!shouldRetry) {
                console.log(`exit`)
                break
            }
            if ((new Date().getTime() - t) > props.maxWaitMS) {
                console.log(`exit`)
                break
            }
        }
    }

    useEffect(() => {
        poll()
    }, [])
    return (
        <>
            {pollingStatus.length > 0 && <span>{pollingStatus}</span>}
        </>
    )
}
export default PollingIndicator