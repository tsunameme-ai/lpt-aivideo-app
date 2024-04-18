import { GenerationOutputItem, GenerationRequest } from '@/libs/types'
import { useEffect, useState } from 'react'


interface LongrunIndicatorProps {
    request: GenerationRequest
    onError?: (error: any) => void
    onComplete?: (outputs: Array<GenerationOutputItem>) => void
}

const LongrunIndicator: React.FC<LongrunIndicatorProps> = (props: LongrunIndicatorProps) => {


    useEffect(() => {
        const connectToStream = () => {
            const id = props.request.id
            setConnectStatus('')
            console.log(`connectToStream ${id}`)
            // https://developer.mozilla.org/en-US/docs/Web/API/EventSource/message_event#examples
            const eventSource = new EventSource(`/api/stream?id=${id}`)
            eventSource.onerror = () => {
                eventSource.close()
                setConnectStatus('🔴 Something just went wrong. Try it later?')
                props.onError?.(new Error('Something just went wrong. Try it later?'))
            }
            eventSource.onmessage = (ev: MessageEvent) => {
                const data = JSON.parse(ev.data)
                if (data.complete === true) {
                    eventSource.close()
                    //setConnectStatus('✅')
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

        const eventSource = connectToStream()
        return () => {
            eventSource.close()
        }
    }, [props.request]
    )

    const [connectStatus, setConnectStatus] = useState<string>('Pending')


    return <>
        {connectStatus}
    </>
}

export default LongrunIndicator