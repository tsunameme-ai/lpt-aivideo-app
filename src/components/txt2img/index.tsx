import { Txt2imgInput, GenerationOutput, SDProvider } from "@/libs/types";
import { useState } from "react";
import ErrorComponent from "../error";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, Textarea, SelectItem, Select } from '@nextui-org/react'
import { txt2img } from "@/actions/stable-diffusion";
import { useGenerationContext } from "@/context/generation-context";

interface Txt2ImgComponentProps {
    sdProvider: SDProvider
    isAdvancedView: boolean
    onImageGenerated: (generationOutput: GenerationOutput) => void
}

const Txt2ImgComponent: React.FC<Txt2ImgComponentProps> = (props: Txt2ImgComponentProps) => {
    const gContext = useGenerationContext()
    const defaultBaseModel = props.sdProvider.models.find(item => { return item.default === true })?.value!
    const defaultScheduler = props.sdProvider.schedulers?.find(item => { return item.default === true })?.value!
    const [baseModel, setBaseModel] = useState<string>(defaultBaseModel)
    const [pPromptValue, setPPromptValue] = useState<string>(gContext.t2iInput?.pPrompt || '')
    const [nPromptValue, setNPromptValue] = useState<string>(gContext.t2iInput?.nPrompt || 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name')
    const [stepsValue, setStepsValue] = useState<string>((gContext.t2iInput?.steps || 20).toString())
    const [seedValue, setSeedValue] = useState<string>(gContext.t2iInput?.seed || '')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [pPromptErrorMessage, setPPromptErrorMessage] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [stepErrorMessage, setStepErrorMessage] = useState<string>('')
    const [scheduler, setScheduler] = useState<string | undefined>(undefined)
    const [guidanceScale, setGuidanceScale] = useState<string>('7')
    const [width, setWidth] = useState<string>((gContext.t2iInput?.width || 768).toString())
    const [height, setHeight] = useState<string>((gContext.t2iInput?.height || 512).toString())
    const [generationOutput, setGenerationOutput] = useState<GenerationOutput | undefined>(undefined)

    const handlePPromptValueChange = (value: string) => {
        setPPromptValue(value)
        setPPromptErrorMessage('')
    }

    const handleSetBaseModel = (key: any) => {
        setBaseModel(key.size === 0 ? defaultBaseModel : key.currentKey)
    }

    const handleSetScheduler = (key: any) => {
        setScheduler(key.size === 0 ? undefined : key.currentKey)
    }

    const generateImage = async () => {
        setErrorMessage('')
        setIsLoading(false)
        setGenerationOutput(undefined)

        const pPrompt = pPromptValue
        if (pPrompt.length === 0) {
            setPPromptErrorMessage('Please set prompt message')
            return
        }

        const stepCount = parseInt(stepsValue)
        if (isNaN(stepCount) || stepCount < 1 || stepCount > 50) {
            setStepErrorMessage('Wrong steps value.')
            return
        }

        const params: Txt2imgInput = {
            pPrompt: pPrompt,
            nPrompt: nPromptValue,
            modelId: baseModel,
            steps: stepCount,
            seed: seedValue.length > 0 ? seedValue : undefined,
            guidanceScale: parseFloat(guidanceScale),
            scheduler: scheduler,
            width: parseInt(width),
            height: parseInt(height)
        }
        gContext.setT2iInput(params)
        setIsLoading(true)
        try {
            const output = await txt2img(params)
            setGenerationOutput(output)
            if (output?.status === 'success') {
                props.onImageGenerated(output)
            }
        }
        catch (error: any) {
            setErrorMessage(error.message || 'Something went wrong.')
        }
        finally {
            setIsLoading(false)
        }
    }

    const handleGotoAsset = async () => {
        props.onImageGenerated(generationOutput!)
    }


    return (
        <>
            <Textarea
                label=''
                placeholder='Try something like "a cat drinks water on the beach"'
                className='max-w'
                value={pPromptValue}
                errorMessage={pPromptErrorMessage}
                onValueChange={handlePPromptValueChange}
            />
            <Spacer y={4} />
            <div hidden={!props.isAdvancedView}>
                <Textarea
                    label='Negative Prompt'
                    placeholder=''
                    value={nPromptValue}
                    onValueChange={setNPromptValue}
                />
                <Spacer y={4} />
                <div className='grid grid-cols-2 gap-4'>
                    <Input
                        label='Width'
                        type='number'
                        value={width}
                        onValueChange={setWidth}
                    />
                    <Input
                        label='Height'
                        type='number'
                        value={height}
                        onValueChange={setHeight}
                    />



                    <Select
                        defaultSelectedKeys={[baseModel]}
                        onSelectionChange={handleSetBaseModel}
                        label="Base Model"
                        errorMessage={baseModel === undefined ? `Must select base model` : ''}
                    >
                        {props.sdProvider.models.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                                {model.label}
                            </SelectItem>
                        ))}
                    </Select>

                    {props.sdProvider.schedulers &&
                        <Select
                            defaultSelectedKeys={[defaultScheduler]}
                            value={[scheduler || '']}
                            onSelectionChange={handleSetScheduler}
                            label='Scheduler'>
                            {props.sdProvider.schedulers.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </Select>}

                    <Input
                        label='Steps'
                        type='number'
                        placeholder='1 to 50'
                        value={stepsValue}
                        errorMessage={stepErrorMessage}
                        onValueChange={setStepsValue}
                    />

                    <Input
                        label='Seed'
                        type='number'
                        placeholder=''
                        value={seedValue}
                        onValueChange={setSeedValue}
                    />

                    <Input
                        label='CFG Scale'
                        description='1 - 20'
                        value={guidanceScale}
                        onValueChange={setGuidanceScale} />
                </div>
                <Spacer y={4} />
            </div>

            <Button
                color='primary' variant='solid'
                onPress={generateImage}
                isLoading={isLoading}
            >
                Generate Image
            </Button>
            <ErrorComponent errorMessage={errorMessage} />
            <Modal isOpen={generationOutput?.status === 'processing'} isDismissable={false}>
                <ModalContent>
                    <ModalHeader>Cooking</ModalHeader>
                    <ModalBody>
                        Your creation is in the works!
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={handleGotoAsset}>
                            Check it out
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    )
};

export default Txt2ImgComponent



