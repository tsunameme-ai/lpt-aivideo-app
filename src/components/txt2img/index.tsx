import { Txt2imgInput, GenerationOutput, SDProvider, DEFAULT_IMG_WIDTH, DEFAULT_IMG_HEIGHT, DEFAULT_IMG_NUM_OUTPUT } from "@/libs/types";
import { useState } from "react";
import ErrorComponent from "../error";
import { Button, Input, Spacer, Textarea, SelectItem, Select } from '@nextui-org/react'
import { txt2img } from "@/actions/stable-diffusion";
import { useGenerationContext } from "@/context/generation-context";
import styles from "@/styles/home.module.css";
import { FaRegPlayCircle } from "react-icons/fa"

interface Txt2ImgComponentProps {
    sdProvider: SDProvider
    isAdvancedView: boolean
    onImagesGenerated: (generationOutput: Array<GenerationOutput>) => void
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
    const [clipSkip, setClipSkip] = useState<string>('1')
    const [numOutput, setNumOutput] = useState<string>(DEFAULT_IMG_NUM_OUTPUT.toString())
    const [width, setWidth] = useState<string>(DEFAULT_IMG_WIDTH.toString())
    const [height, setHeight] = useState<string>(DEFAULT_IMG_HEIGHT.toString())

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

        //Clear context for future steps
        gContext.setT2iOutputSelectedIndex(0)
        gContext.setCoverImageData(undefined)
        gContext.setCoverText('')
        gContext.setT2iInput(undefined)
        gContext.setT2iOutputs([])

        const pPrompt = pPromptValue
        if (pPrompt.length === 0) {
            //setPPromptErrorMessage('Please set prompt message')
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
            height: parseInt(height),
            numOutput: parseInt(numOutput)
        }
        gContext.setT2iInput(params)
        setIsLoading(true)
        try {
            const outputs = await txt2img(params)
            if (outputs.length > 0) {
                gContext.setT2iOutputs(outputs)
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
            <div className={styles.textareaControl}>
                <Textarea
                    maxRows={4}
                    label=''
                    placeholder='Try something like "a cat drinks water on the beach"'
                    className={styles.textPrompt}
                    value={pPromptValue}
                    errorMessage={pPromptErrorMessage}
                    onValueChange={handlePPromptValueChange}
                />
                <Button isIconOnly size="lg" variant="light" className={styles.renderBtn} onPress={generateImage} isLoading={isLoading}>
                    <FaRegPlayCircle />
                </Button>
                <ErrorComponent errorMessage={errorMessage} />
            </div>
            <Spacer y={1} />
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
                    <Select
                        defaultSelectedKeys={[baseModel]}
                        onSelectionChange={handleSetBaseModel}
                        label="Use a model"
                        errorMessage={baseModel === undefined ? `Must select base model` : ''}
                    >
                        {props.sdProvider.models.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                                {model.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <Spacer y={4} />
            </div>

        </>

    )
};

export default Txt2ImgComponent



