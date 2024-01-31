import { API } from "@/api/api";
import { GenerationOutput } from "@/api/types";
import { Button, Spacer } from "@nextui-org/react"
import { useEffect, useState } from "react";
import ErrorComponent from "../error";
interface GenerationStatusComponentProps {
    assetType: string
    generationId: string
    onOutputFetched: (output: GenerationOutput) => void
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
            const output = await API.fetchAsset(props.generationId)
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