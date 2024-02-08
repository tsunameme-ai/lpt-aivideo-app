import { GenerationOutput, GenerationRequest } from '@/libs/types'
import { useEffect, useState } from 'react'


interface LongrunListenerProps {
    request: GenerationRequest
    onError?: (error: any) => void
    onComplete?: (output: GenerationOutput) => void
}

const LongrunListener: React.FC<LongrunListenerProps> = (props: LongrunListenerProps) => {

    const connectToStream = () => {
        const id = props.request.id
        console.log(`connectToStream ${id}`)
        // https://developer.mozilla.org/en-US/docs/Web/API/EventSource/message_event#examples
        const eventSource = new EventSource(`/api/stream?id=${id}`)
        eventSource.onerror = (ev: Event) => {
            console.log(`eventSource.onerror`)
            console.log(ev)
            eventSource.close()
            setConnectStatus('🔴')
            if (props.onError) {
                props.onError(new Error('Unable to fetch generation result'))
            }
        }
        eventSource.onmessage = (ev: MessageEvent) => {
            console.log(`eventSource.onmessage`)
            console.log(ev)
            const data = JSON.parse(ev.data)
            console.log(data)
            if (data.complete === true) {
                eventSource.close()
                setConnectStatus('')
                if (props.onComplete) {
                    props.onComplete(data.data)
                }
            }
            else {
                setConnectStatus(`🟢 ${data.data}`)
            }
        }
        eventSource.onopen = (ev: Event) => {
            console.log(`eventSource.onopen`)
            console.log(ev)
            setConnectStatus('🟢')
        }
        // eventSource.send(JSON.stringify({ param1: 'value1', param2: 'value2' }));
        return eventSource
    }
    useEffect(() => {
        // Initiate the first call to connect to SSE API
        const eventSource = connectToStream()
        // As the component unmounts, close listener to SSE API
        return () => {
            console.info("Closing SSE");
            eventSource.close()
        }
    }, [props.request])
    const [connectStatus, setConnectStatus] = useState<string>('Pending')


    return <>
        {connectStatus}
        {props.request.id}
    </>
}

export default LongrunListener