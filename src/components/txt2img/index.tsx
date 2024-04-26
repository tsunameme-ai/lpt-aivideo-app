'use client'
import { Txt2imgInput, GenerationOutputItem, DEFAULT_IMG_WIDTH, DEFAULT_IMG_HEIGHT, DEFAULT_IMG_NUM_OUTPUT } from "@/libs/types";
import { Input, Spacer, Textarea, SelectItem, Select, Button } from '@nextui-org/react'
import { txt2img } from "@/actions/stable-diffusion";
import { useGenerationContext } from "@/context/generation-context";
import { Analytics } from "@/libs/analytics";
import { usePrivy } from "@privy-io/react-auth"
import { PrimaryButton } from "../buttons";
import { useState } from "react";
import styles from '@/styles/home.module.css'
import { FaDice } from "react-icons/fa6";

enum GenRequestType {
    FIRSTTIME = 'FIRSTTIME',
    REQUEST_MORE = 'REQUEST_MORE',
    REGENERATE = 'REGENERATE'
}

interface Txt2ImgComponentProps {
    isAdvancedView: boolean
    onImagesGenerated: (outputs: Array<GenerationOutputItem>, resetSelectedIndex: number) => void
}

const Txt2ImgComponent: React.FC<Txt2ImgComponentProps> = (props: Txt2ImgComponentProps) => {
    const MAX_OUTPUT_COUNT = 12
    const { authenticated, user } = usePrivy()
    const gContext = useGenerationContext()
    const defaultBaseModel = gContext.config.models.find(item => { return item.default === true })?.value!
    const outputFromContext: GenerationOutputItem | undefined = gContext.t2iOutputs ? gContext.t2iOutputs[gContext.t2iOutputSelectedIndex] : undefined
    const [baseModel, setBaseModel] = useState<string>(defaultBaseModel)
    const [genType, setGenType] = useState<GenRequestType>((outputFromContext?.input as Txt2imgInput)?.pPrompt === undefined ? GenRequestType.FIRSTTIME : GenRequestType.REQUEST_MORE)
    const [pPromptValue, setPPromptValue] = useState<string>((outputFromContext?.input as Txt2imgInput)?.pPrompt || gContext.shufflePrompt())
    const [nPromptValue, setNPromptValue] = useState<string>((outputFromContext?.input as Txt2imgInput)?.nPrompt || 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name')
    const [seedValue, setSeedValue] = useState<string>((outputFromContext?.input as Txt2imgInput)?.seed?.toString() || '')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [guidanceScale, setGuidanceScale] = useState<string>('7')
    const [numOutput, setNumOutput] = useState<string>(DEFAULT_IMG_NUM_OUTPUT.toString())
    const [width, setWidth] = useState<string>(DEFAULT_IMG_WIDTH.toString())
    const [height, setHeight] = useState<string>(DEFAULT_IMG_HEIGHT.toString())

    const handlePPromptValueChange = (value: string) => {
        setPPromptValue(value)

        if (genType === GenRequestType.REQUEST_MORE) {
            setGenType(GenRequestType.REGENERATE)
        }
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
        gContext.setT2iOutputs([])
        gContext.setI2vInput(undefined)

        const pPrompt = pPromptValue
        if (pPrompt.length === 0) {
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
        setIsLoading(true)
        try {
            const outputs = await txt2img(params)
            if (outputs.length > 0) {
                for (let output of outputs) {
                    output.input = params
                }
                let resultOutputs
                let resetSelectedIndex
                if (genType === GenRequestType.REQUEST_MORE) {
                    resultOutputs = gContext.t2iOutputs.concat(outputs)
                    resetSelectedIndex = gContext.t2iOutputs.length
                }
                else {
                    resultOutputs = outputs
                    resetSelectedIndex = 0
                }
                gContext.setT2iOutputs(resultOutputs)
                gContext.setT2iOutputSelectedIndex(resetSelectedIndex)
                props.onImagesGenerated(resultOutputs, resetSelectedIndex)
            }
            setGenType(GenRequestType.REQUEST_MORE)
        }
        catch (error: any) {
            setErrorMessage(error.message || 'Something went wrong.')
        }
        finally {
            setIsLoading(false)
        }
    }
    const renderGenerateButton = () => {
        switch (genType) {
            case GenRequestType.FIRSTTIME:
                return <PrimaryButton isDisabled={pPromptValue.length === 0} isLoading={isLoading} onPress={generateImage}>Generate</PrimaryButton>
            case GenRequestType.REQUEST_MORE:
                return <PrimaryButton variant="bordered" isDisabled={pPromptValue.length === 0 || gContext.t2iOutputs.length >= MAX_OUTPUT_COUNT} isLoading={isLoading} onPress={generateImage}>Fetch more images</PrimaryButton>
            case GenRequestType.REGENERATE:
                return <PrimaryButton variant="bordered" isDisabled={pPromptValue.length === 0} isLoading={isLoading} onPress={generateImage}>Regenerate</PrimaryButton>
            default:
                return <></>
        }
    }

    return (
        <>

            <div className='relative'>
                <Textarea
                    radius="sm"
                    maxRows={3}
                    label=''
                    value={pPromptValue}
                    errorMessage={errorMessage}
                    onValueChange={handlePPromptValueChange}
                    classNames={{
                        input: "text-lg",
                        inputWrapper: "border-primary",
                    }}
                />
                <Button isDisabled={isLoading} isIconOnly size="lg" variant="light" className={styles.renderBtn} onPress={() => { handlePPromptValueChange(gContext.shufflePrompt()) }}>
                    <FaDice size={26} />
                </Button>

            </div>
            <Spacer y={4} />
            {renderGenerateButton()}
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

                    {/* Disable width and height input */}
                    <Input
                        isDisabled={true}
                        label='Width'
                        type='number'
                        value={width}
                        onValueChange={setWidth}
                    />
                    <Input
                        isDisabled={true}
                        label='Height'
                        type='number'
                        value={height}
                        onValueChange={setHeight}
                    />
                </div>
                <Spacer y={4} />
            </div>
        </>
    )
};

export default Txt2ImgComponent