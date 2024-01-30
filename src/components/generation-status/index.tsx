import { API } from "@/api/api";
import { GenerationOutput } from "@/api/types";
import { Button, Spacer } from "@nextui-org/react"
import { useEffect, useState } from "react";
import ErrorComponent from "../error";
interface GenerationStatusComponentProps {
    // errorMessage: string
    assetType: string
    generationId: string
    onOutputFetched: (output: GenerationOutput) => void
    // generationOutput: GenerationOutput
}

const GenerationStatusComponent: React.FC<GenerationStatusComponentProps> = (props: GenerationStatusComponentProps) => {
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [generationOutput, setGenerationOutput] = useState<GenerationOutput | null>(null)
    useEffect(() => {
        fetchAsset()
            .catch(console.error)
    }, [])

    const fetchAsset = async () => {
        setIsFetching(true)
        setErrorMessage('')

        try {
            // const output = await API.fetchAsset(props.generationId)
            const output = props.generationId === '70564946' ? {
                id: '70564946',
                status: 'success',
                mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/0-964f8944-85d8-41d2-963a-0b7f2ce4e9e9.png'
            } : await API.fetchAsset(props.generationId)
            // if (params.vid === '70564946')
            setGenerationOutput(output)
            setErrorMessage('')
            props.onOutputFetched(output)
        }
        catch (error: any) {
            setErrorMessage(error.message || 'Something went wrong.')
        }
        finally {
            setIsFetching(false)
        }
    }
    const handleFetchClick = async (e: any) => {
        fetchAsset()
    }
    return (
        <div hidden={generationOutput?.status === 'success'}>
            <Spacer y={4} />
            <p>Your {props.assetType} is being processed.</p>
            <Spacer y={4} />
            <Button
                hidden={true}
                color="primary"
                isLoading={isFetching}
                onPress={handleFetchClick}>
                Check generation status again
            </Button>
            <ErrorComponent errorMessage={errorMessage} />
            <Spacer y={4} />
        </div>
    );
};

export default GenerationStatusComponent