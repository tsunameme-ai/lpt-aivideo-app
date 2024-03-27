import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, Slider, Spacer } from "@nextui-org/react"
import { useState } from "react"
import styles from '@/styles/home.module.css'

interface EditTextModalComponentProps {
    initialText?: string
    initialOpacity?: number
    isOpen: boolean
    onClose?: (text: string, opacity: number) => void
}

const EditTextModalComponent: React.FC<EditTextModalComponentProps> = (props: EditTextModalComponentProps) => {
    const LABEL_VALUE = 'Be creative or die'
    const MAX_CHARACTER = 125
    const [textValue, setTextValue] = useState<string>(props.initialText || '')
    const [labelValue, setLabelValue] = useState<string>(LABEL_VALUE)
    const [sliderValue, setSliderValue] = useState(props.initialOpacity || 0)

    const handleTextValueChange = (value: string) => {
        if (value.length <= MAX_CHARACTER) {
            setTextValue(value)
            setLabelValue(`${LABEL_VALUE} (${value.length}/${MAX_CHARACTER})`)
        }
    }

    const handleSliderValue = (value: number | number[]) => {
        if (!Array.isArray(value))
            setSliderValue(value)
    }


    return (
        <>
            <Modal className={styles.editorModal} placement='top' size='lg' radius='sm'
                isOpen={props.isOpen} onClose={() => { props.onClose?.(textValue, sliderValue) }}
                classNames={{
                    body: "px-4",
                    header: "color-[#292f46]"
                }}
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader />
                            <ModalBody>
                                <Textarea
                                    classNames={{
                                        input: "font-normal text-lg",
                                        label: "font-normal text-sm",
                                        inputWrapper: "border-[#FFC30C]"
                                    }}
                                    maxRows={3}
                                    value={textValue}
                                    label={labelValue}
                                    placeholder=''
                                    onValueChange={handleTextValueChange}
                                    variant='bordered'
                                    size="lg"
                                    errorMessage=""
                                />
                                <Spacer y={1} />
                                <Slider
                                    label='Background Opacity:'
                                    step={0.01}
                                    maxValue={1}
                                    minValue={0}
                                    defaultValue={sliderValue}
                                    classNames={{
                                        base: "max-w-md",
                                        filler: "bg-gradient-to-r from-primary-500 to-secondary-400",
                                        labelWrapper: "mb-2",
                                        label: "font-normal text-default-900 text-md",
                                        value: "font-normal text-default-900 text-md",
                                        thumb: [
                                            "transition-size",
                                            "bg-gradient-to-r from-secondary-400 to-primary-500",
                                            "data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20",
                                            "data-[dragging=true]:w-7 data-[dragging=true]:h-7 data-[dragging=true]:after:h-6 data-[dragging=true]:after:w-6"
                                        ],
                                        step: "data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50"
                                    }}
                                    onChange={handleSliderValue}
                                />

                            </ModalBody>
                            <ModalFooter>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}

export default EditTextModalComponent