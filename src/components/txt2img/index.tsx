import { Txt2imgInput, GenerationOutput, SDProvider } from "@/libs/types";
import { useState } from "react";
import ErrorComponent from "../error";
import { Button, Input, Spacer, Textarea, SelectItem, Select, Divider } from '@nextui-org/react'
import { txt2img } from "@/actions/stable-diffusion";

interface Txt2ImgComponentProps {
    sdProvider: SDProvider
    isAdvancedView: boolean
    onImagesGenerated: (generationOutput: Array<GenerationOutput>) => void
}

const Txt2ImgComponent: React.FC<Txt2ImgComponentProps> = (props: Txt2ImgComponentProps) => {
    const defaultBaseModel = props.sdProvider.models.find(item => { return item.default === true })?.value!
    const defaultScheduler = props.sdProvider.schedulers?.find(item => { return item.default === true })?.value!
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
    const [scheduler, setScheduler] = useState<string | undefined>(undefined)
    const [loraStrength, setLoraStrength] = useState<string>('1.0')
    const [guidanceScale, setGuidanceScale] = useState<string>('7')
    const [clipSkip, setClipSkip] = useState<string>('1')
    const [numOutput, setNumOutput] = useState<string>('1')
    const [width, setWidth] = useState<string>('768')
    const [height, setHeight] = useState<string>('512')
    const [generationOutputs, setGenerationOutputs] = useState<GenerationOutput | undefined>(undefined)

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
        setScheduler(key.size === 0 ? undefined : key.currentKey)
    }

    const generateImage = async () => {
        setErrorMessage('')
        setIsLoading(false)
        setGenerationOutputs(undefined)

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
            clipSkip: parseInt(clipSkip),
            loraModel: lora,
            loraStrength: lora === undefined ? undefined : parseFloat(loraStrength),
            scheduler: scheduler,
            width: parseInt(width),
            height: parseInt(height),
            numOutput: parseInt(numOutput)
        }
        setIsLoading(true)
        try {
            const outputs = await txt2img(params)
            if (outputs.length > 0) {
                setGenerationOutputs(outputs)
                props.onImagesGenerated(outputs)
            }
        }
        catch (error: any) {
            setErrorMessage(error.message || 'Something went wrong.')
        }
        finally {
            setIsLoading(false)
        }
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

                    <Input
                        label='Clip Skip'
                        description='1 - 8'
                        value={clipSkip}
                        onValueChange={setClipSkip} />
                    <Input
                        label='Num of Images'
                        value={numOutput}
                        onValueChange={setNumOutput} />
                </div>

                {props.sdProvider.loras && <>
                    <Spacer y={4} />
                    <Divider />
                    <Spacer y={4} />
                    <div className='grid grid-cols-2 gap-4'>
                        <Select
                            value={[lora || '']}
                            onSelectionChange={handleSetLora}
                            label="Lora">
                            {props.sdProvider.loras.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </Select>

                        <Input
                            label='Lora Strength'
                            type='number'
                            placeholder='0 to 1'
                            value={loraStrength.toString()}
                            errorMessage={stepErrorMessage}
                            onValueChange={setLoraStrength}
                        />
                    </div>
                </>}
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
        </>

    )
};

export default Txt2ImgComponent



