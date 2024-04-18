import { Modal, ModalContent, ModalHeader, ModalBody, Textarea } from "@nextui-org/react"
import { useEffect, useRef, useState } from "react"
import styles from '@/styles/home.module.css'
import { appFont } from "@/app/fonts"
import { SecondaryButton } from "../buttons"

interface EditTextModalComponentProps {
    imageUrl: string
    width: number
    height: number
    text?: string
    opacity: number
    isOpen: boolean
    onClose?: (text: string, opacity: number) => void
}

const EditTextModalComponent: React.FC<EditTextModalComponentProps> = (props: EditTextModalComponentProps) => {
    const LABEL_VALUE = 'Be creative or die'
    const MAX_CHARACTER = 125
    const taRef = useRef<any>(undefined)
    const [textValue, setTextValue] = useState<string>(props.text || '')
    const [labelValue, setLabelValue] = useState<string>(LABEL_VALUE)
    const [opacity] = useState(props.opacity || 0)

    const handleTextValueChange = (value: string) => {
        if (value.length <= MAX_CHARACTER) {
            setTextValue(value)
            setLabelValue(`${LABEL_VALUE} (${value.length}/${MAX_CHARACTER})`)
        }
    }
    useEffect(() => {
        handleTextValueChange(props.text || '')
    }, [props.text])

    const handleClickClose = () => {
        props.onClose?.(textValue, opacity)
    }

    useEffect(() => {
        if (taRef.current) {
            taRef.current.focus()
            setTimeout(() => {
                const textAreaLength = taRef.current.value.length;
                taRef.current.selectionStart = textAreaLength;
                taRef.current.selectionEnd = textAreaLength;
            }, 100);
        }
    }, []);

    return (
        <>
            <Modal className={`${styles.editorModal} ${appFont.className} bg-background`} size='full' radius='none' placement='center'
                isOpen={props.isOpen}
                onClose={() => { props.onClose?.(textValue, opacity) }}
                onOpenChange={(isOpen: boolean) => {
                    if (isOpen && taRef) {
                        taRef.current.focus()
                    }
                }}
                hideCloseButton={true}
                isDismissable={false}
                motionProps={{
                    variants: {
                        enter: {
                            x: 0,
                            y: 0,
                            opacity: 1
                        },
                        exit: {
                            x: 0,
                            y: 0,
                            opacity: 0
                        },
                    },
                }}
            >
                <ModalContent id='text-editor-wrapper'>
                    {() => (
                        <>
                            <ModalHeader className="font-normal">
                                <div>{labelValue}</div>
                                <SecondaryButton className="font-medium" style={{ position: 'absolute', top: '10px', right: '16px' }} onPress={handleClickClose}>
                                    Done
                                </SecondaryButton>
                            </ModalHeader>
                            <ModalBody className="items-center">
                                <div style={{ width: `${props.width}px`, height: `${props.height}px` }}>
                                    <div className="w-full h-full bg-img bg-contain bg-no-repeat" style={{ backgroundImage: `url(${props.imageUrl})` }}>
                                        <div className={`w-full h-full bg-white/40`}>
                                            <Textarea
                                                ref={taRef}
                                                fullWidth={true}
                                                classNames={{
                                                    base: `w-full h-full`,
                                                    input: "font-normal text-lg w-full h-full text-center",
                                                    inputWrapper: `border-primary w-full h-full`
                                                }}
                                                radius='none'
                                                disableAutosize
                                                style={{ height: `${props.height - 24}px` }}
                                                value={textValue}
                                                onValueChange={handleTextValueChange}
                                                variant='bordered'
                                                size="lg"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}

export default EditTextModalComponent