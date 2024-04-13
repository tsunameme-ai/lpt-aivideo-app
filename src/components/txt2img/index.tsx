'use client'
import { Txt2imgInput, GenerationOutputItem, DEFAULT_IMG_WIDTH, DEFAULT_IMG_HEIGHT, DEFAULT_IMG_NUM_OUTPUT } from "@/libs/types";
import { useState } from "react";
import ErrorComponent from "../error";
import { Button, Input, Spacer, Textarea, SelectItem, Select } from '@nextui-org/react'
import { txt2img } from "@/actions/stable-diffusion";
import { useGenerationContext } from "@/context/generation-context";
import styles from "@/styles/home.module.css";
import { FaArrowRotateRight } from "react-icons/fa6"
import { Analytics } from "@/libs/analytics";
import { usePrivy } from "@privy-io/react-auth";
import { appFont } from "@/app/fonts";

interface Txt2ImgComponentProps {
    isAdvancedView: boolean
    onImagesGenerated: (generationOutput: Array<GenerationOutputItem>) => void
    onImagesError: (error: any) => void
}

const Txt2ImgComponent: React.FC<Txt2ImgComponentProps> = (props: Txt2ImgComponentProps) => {
    const { authenticated, user } = usePrivy()
    const gContext = useGenerationContext()
    const defaultBaseModel = gContext.config.models.find(item => { return item.default === true })?.value!
    const [baseModel, setBaseModel] = useState<string>(defaultBaseModel)
    const [pPromptValue, setPPromptValue] = useState<string>(gContext.t2iInput?.pPrompt || '')
    const [nPromptValue, setNPromptValue] = useState<string>(gContext.t2iInput?.nPrompt || 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name')
    const [seedValue, setSeedValue] = useState<string>(gContext.t2iInput?.seed?.toString() || '')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [pPromptErrorMessage, setPPromptErrorMessage] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [guidanceScale, setGuidanceScale] = useState<string>('7')
    const [numOutput, setNumOutput] = useState<string>(DEFAULT_IMG_NUM_OUTPUT.toString())
    const [width, setWidth] = useState<string>(DEFAULT_IMG_WIDTH.toString())
    const [height, setHeight] = useState<string>(DEFAULT_IMG_HEIGHT.toString())
    const [isEmptyPrompt, setIsEmptyPrompt] = useState<boolean>(true)

    const handlePPromptValueChange = (value: string) => {
        setIsEmptyPrompt(value.length <= 0)
        setPPromptValue(value)
        setPPromptErrorMessage('')
    }

    const handleSetBaseModel = (key: any) => {
        setBaseModel(key.size === 0 ? defaultBaseModel : key.currentKey)
    }

    const generateImage = async () => {
        Analytics.trackEvent({ 'event': 'click-2img' })
        if ((parseInt(width) % 8 != 0) || (parseInt(height) % 8 != 0)) {
            setErrorMessage('Width and height must be divisible by 8')
            return
        }
        setErrorMessage('')
        setIsLoading(false)

        //Clear context for future steps
        gContext.setT2iOutputSelectedIndex(0)
        gContext.setOverlayImageData(undefined)
        gContext.setOverlayText('')
        gContext.setT2iInput(undefined)
        gContext.setT2iOutputs([])
        gContext.setI2vInput(undefined)

        const pPrompt = pPromptValue
        if (pPrompt.length === 0) {
            //setPPromptErrorMessage('Please set prompt message')
            return
        }

        const params: Txt2imgInput = {
            pPrompt: pPrompt,
            nPrompt: nPromptValue,
            modelId: baseModel,
            seed: seedValue.length > 0 ? parseInt(seedValue) : undefined,
            guidanceScale: parseFloat(guidanceScale),
            width: parseInt(width),
            height: parseInt(height),
            numOutput: parseInt(numOutput),
            userId: authenticated && user ? user.id : undefined
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
            props.onImagesError(error)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className={`${styles.textareaControl} ${appFont.className}`}>
                <Textarea
                    radius="sm"
                    maxRows={3}
                    label=''
                    placeholder='Try "eating breakfast in front of a scary tsunami"'
                    value={pPromptValue}
                    errorMessage={pPromptErrorMessage}
                    onValueChange={handlePPromptValueChange}
                    classNames={{
                        input: "text-lg"
                    }}
                />
                <Button isIconOnly isDisabled={isEmptyPrompt} size="lg" variant="light" className={styles.renderBtn} onPress={generateImage} isLoading={isLoading}>
                    <FaArrowRotateRight size={25} />
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
                        label='Num of Images'
                        value={numOutput}
                        onValueChange={setNumOutput} />
                    <Select
                        defaultSelectedKeys={[baseModel]}
                        onSelectionChange={handleSetBaseModel}
                        label="Use a model"
                        errorMessage={baseModel === undefined ? `Must select base model` : ''}
                    >
                        {gContext.config.models.map((model) => (
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



