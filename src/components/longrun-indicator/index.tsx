import { GenerationOutput, GenerationRequest } from '@/libs/types'
import { useEffect, useState } from 'react'


interface LongrunIndicatorProps {
    request: GenerationRequest
    onError?: (error: any) => void
    onComplete?: (output: GenerationOutput) => void
}

const LongrunIndicator: React.FC<LongrunIndicatorProps> = (props: LongrunIndicatorProps) => {

    const connectToStream = () => {
        const id = props.request.id
        console.log(`connectToStream ${id}`)
        // https://developer.mozilla.org/en-US/docs/Web/API/EventSource/message_event#examples
        const eventSource = new EventSource(`/api/stream?id=${id}`)
        eventSource.onerror = () => {
            eventSource.close()
            setConnectStatus('🔴')
            props.onError?.(new Error('Error occured while fething generation result'))
        }
        eventSource.onmessage = (ev: MessageEvent) => {
            const data = JSON.parse(ev.data)
            if (data.complete === true) {
                eventSource.close()
                setConnectStatus('✅')
                props.onComplete?.(data.data)
            }
            else {
                setConnectStatus(`🟢 ${data.data}`)
            }
        }
        eventSource.onopen = () => {
            setConnectStatus('🟢')
        }
        // eventSource.send(JSON.stringify({ param1: 'value1', param2: 'value2' }));
        return eventSource
    }
    useEffect(() => {
        const eventSource = connectToStream()
        return () => {
            eventSource.close()
        }
    }, [props.request]
    )
    const [connectStatus, setConnectStatus] = useState<string>('Pending')


    return <>
        {connectStatus} | job id:{props.request.id}
    </>
}

export default LongrunIndicator