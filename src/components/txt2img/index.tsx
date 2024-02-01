import { Loras, SDModels, Txt2imgInput, GenerationOutput, Schedulers } from "@/api/types";
import { useState } from "react";
import ErrorComponent from "../error";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, Textarea, SelectItem, Select, Slider } from '@nextui-org/react'
import { txt2img } from "@/api/txt2img";


interface Txt2ImgComponentProps {
    onGenerationRequested: (generationOutput: GenerationOutput) => void
}

const Txt2ImgComponent: React.FC<Txt2ImgComponentProps> = (props: Txt2ImgComponentProps) => {
    const defaultBaseModel = 'sd-1.5'
    const defaultScheduler = 'EulerAncestralDiscreteScheduler'
    const [baseModel, setBaseModel] = useState<string>(defaultBaseModel)
    const [pPromptValue, setPPromptValue] = useState<string>('')
    const [nPromptValue, setNPromptValue] = useState<string>('lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name')
    const [stepsValue, setStepsValue] = useState<string>('20')
    const [seedValue, setSeedValue] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [pPromptErrorMessage, setPPromptErrorMessage] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [stepErrorMessage, setStepErrorMessage] = useState<string>('')
    const [lora, setLora] = useState<string | undefined>(undefined)
    const [scheduler, setScheduler] = useState<string>(defaultScheduler)
    const [loraStrength, setLoraStrength] = useState<number | number[]>(1.0)
    const [guidanceScale, setGuidanceScale] = useState<number | number[]>(7.5)
    const [clipSkip, setClipSkip] = useState<number | number[]>(1)
    const [generationOutput, setGenerationOutput] = useState<GenerationOutput | undefined>(undefined)

    const handlePPromptValueChange = (value: string) => {
        setPPromptValue(value)
        setPPromptErrorMessage('')
    }

    const handleSetBaseModel = (key: any) => {
        setBaseModel(key.size === 0 ? defaultBaseModel : key.currentKey)
    }
    const handleSetLora = (key: any) => {
        setLora(key.size === 0 ? undefined : key.currentKey)
    }
    const handleSetScheduler = (key: any) => {
        setScheduler(key.size === 0 ? defaultScheduler : key.currentKey)
    }

    const generateImage = async () => {
        console.log('??? generateImage')
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
            guidanceScale: guidanceScale as number,
            clipSkip: clipSkip as number,
            loraModel: lora === undefined ? undefined : lora,
            loraStrength: lora === undefined ? undefined : loraStrength as number,
            scheduler: scheduler
        }
        setIsLoading(true)
        try {
            const output = await txt2img(params)
            setGenerationOutput(output)
            if (output?.status === 'success') {
                props.onGenerationRequested(output)
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
        props.onGenerationRequested(generationOutput!)
    }


    return (
        <>
            <Textarea
                label='Prompt'
                className='max-w'
                value={pPromptValue}
                errorMessage={pPromptErrorMessage}
                onValueChange={handlePPromptValueChange}
            />
            <Spacer y={4} />
            <div hidden={process.env.NEXT_PUBLIC_API !== 'modelslab'}>
                <Textarea
                    label='Negative Prompt'
                    placeholder=''
                    value={nPromptValue}
                    onValueChange={setNPromptValue}
                />
                <Spacer y={4} />
                <Select
                    defaultSelectedKeys={[baseModel]}
                    onSelectionChange={handleSetBaseModel}
                    label="Base Model"
                    errorMessage={baseModel === undefined ? `Must select base model` : ''}
                >
                    {SDModels.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                            {model.label}
                        </SelectItem>
                    ))}
                </Select>
                <Spacer y={4} />
                <Input
                    label='Steps'
                    type='number'
                    placeholder='1 to 50'
                    value={stepsValue}
                    errorMessage={stepErrorMessage}
                    onValueChange={setStepsValue}
                />
                <Spacer y={4} />
                <Select
                    value={[lora || '']}
                    onSelectionChange={handleSetLora}
                    label="Lora"
                >
                    {Loras.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                            {model.label}
                        </SelectItem>
                    ))}
                </Select>
                <Spacer y={4} />
                <Slider
                    label='Lora Strength'
                    step={0.1}
                    maxValue={1}
                    minValue={0}
                    value={loraStrength}
                    onChange={setLoraStrength}
                />
                <Spacer y={4} />
                <Input
                    label='Seed'
                    type='number'
                    placeholder=''
                    value={seedValue}
                    onValueChange={setSeedValue}
                />
                <Spacer y={4} />
                <Select
                    defaultSelectedKeys={[defaultScheduler]}
                    value={[scheduler]}
                    onSelectionChange={handleSetScheduler}
                    label='Scheduler'
                >
                    {Schedulers.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                            {model.label}
                        </SelectItem>
                    ))}
                </Select>
                <Spacer y={4} />
                <Slider
                    label='Guidance Scale'
                    step={0.1}
                    maxValue={20}
                    minValue={1}
                    value={guidanceScale}
                    onChange={setGuidanceScale}
                />
                <Spacer y={4} />
                <Slider
                    label='Clip Skip'
                    step={1}
                    maxValue={8}
                    minValue={1}
                    value={clipSkip}
                    onChange={setClipSkip}
                />
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



