'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { Card, CardBody, CardHeader, Divider, Input, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, Textarea, SelectItem, Select, Checkbox, Slider } from '@nextui-org/react'
import { useState } from "react"
import { API } from '@/api/api'
import { Txt2imgInput, VideoGenerationOutput, SDModels, Loras } from '@/api/types'

export default function Page() {
    const router = useRouter()
    const defaultBaseModel = 'sd-1.5'
    const [baseModel, setBaseModel] = useState<string>(defaultBaseModel)
    const [pPromptValue, setPPromptValue] = useState<string>('ultra realistic close up portrait ((beautiful pale cyberpunk female with heavy black eyeliner)), blue eyes, shaved side haircut, hyper detail, cinematic lighting, magic neon, dark red city, Canon EOS R3, nikon, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame, 8K')
    const [nPromptValue, setNPromptValue] = useState<string>('painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime')
    const [stepsValue, setStepsValue] = useState<string>('20')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [pPromptErrorMessage, setPPromptErrorMessage] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [stepErrorMessage, setStepErrorMessage] = useState<string>('')
    const [lora, setLora] = useState<string | null>(null)
    const [loraStrength, setLoraStrength] = useState<number | number[]>(1.0)
    const [vidOutput, setVidOutput] = useState<VideoGenerationOutput | null>(null)

    const handlePPromptValueChange = (value: string) => {
        setPPromptValue(value)
        setPPromptErrorMessage('')
    }

    const handleSetBaseModel = (key: any) => {
        setBaseModel(key.currentKey)
    }
    const handleSetLora = (key: any) => {
        setLora(key.size === 0 ? null : key.currentKey)
    }

    const generateVideo = async (e: any) => {
        setErrorMessage('')
        setIsLoading(false)
        setVidOutput(null)

        const pPrompt = pPromptValue
        if (pPrompt.length === 0) {
            setPPromptErrorMessage('Please set prompt message')
            return
        }

        setIsLoading(true)
        const stepCount = parseInt(stepsValue)
        if (isNaN(stepCount) || stepCount < 0) {
            setStepErrorMessage('Wrong steps value.')
            return
        }
        const params: Txt2imgInput = {
            pPrompt: pPrompt,
            nPrompt: nPromptValue,
            modelId: baseModel,
            steps: stepCount
        }
        if (lora) {
            params.loraModel = lora
            params.loraStrength = loraStrength as number
        }

        try {
            const vid = await API.txt2img(params)
            setVidOutput(vid)
        }
        catch (error: any) {
            setErrorMessage(error.message || 'Something went wrong.')
        }
        finally {
            setIsLoading(false)
        }
    }

    const handleGotoAsset = async () => {
        router.push(`/image/${vidOutput?.id}`)
    }

    return (
        <>
            <section>
                <Card>
                    <CardHeader>
                        <h1>Text to Image</h1>
                        <small>Image to video is under construction🚧</small>
                        <Spacer y={4} />
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <Select
                            defaultSelectedKeys={[baseModel]}
                            onSelectionChange={handleSetBaseModel}
                            label="Base Model"
                        >
                            {SDModels.map((model) => (
                                <SelectItem key={model.value} value={model.value}>
                                    {model.label}
                                </SelectItem>
                            ))}
                        </Select>
                        <Spacer y={4} />
                        <Textarea
                            label='Prompt'
                            placeholder='midjourney positive'
                            className='max-w'
                            value={pPromptValue}
                            errorMessage={pPromptErrorMessage}
                            onValueChange={handlePPromptValueChange}
                        />
                        <Spacer y={4} />
                        <Textarea
                            label='Negative Prompt'
                            placeholder=''
                            value={nPromptValue}
                            onValueChange={setNPromptValue}
                        />
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

                        <Button
                            color='primary' variant='solid'
                            onPress={generateVideo}
                            isLoading={isLoading}
                        >
                            Generate
                        </Button>
                        <div hidden={errorMessage.length == 0}>
                            <Spacer y={1} />
                            <p className='text-tiny text-danger'>{errorMessage}</p>
                            <Spacer y={4} />
                        </div>
                    </CardBody>
                </Card>
                <Spacer y={4} />
                <div hidden={vidOutput === null} style={{ display: "flex", justifyContent: "center" }}>
                    <Image
                        src={vidOutput?.mediaUrl}
                        width={512}
                        height={512}
                    />
                </div>
                <Spacer y={4} />
            </section>

            <Modal isOpen={vidOutput?.status === 'processing'} isDismissable={false}>
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
}
