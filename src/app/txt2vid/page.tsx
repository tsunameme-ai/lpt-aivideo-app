'use client'
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, Textarea } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { API } from '@/api/api'
import { Txt2VidSchedulers, Txt2vidInput, Txt2vidOutput } from '@/api/types';

export default function Page() {
    const router = useRouter();
    const [pPromptValue, setPPromptValue] = useState<string>('');
    const [nPromptValue, setNPromptValue] = useState<string>('low quality, watermark, watermark, copyright, blurry, nsfw');
    const [secondsValue, setSecondsValue] = useState<string>('3');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [nPromoptErrorMessage, setNPromoptErrorMessage] = useState<string>('');
    const [secondsErrorMessage, setSecondsErrorMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [vidOutput, setVidOutput] = useState<Txt2vidOutput | null>(null)


    const handlePPromptValueChange = (value: string) => {
        setPPromptValue(value);
        setNPromoptErrorMessage('')
    };

    const handleNPromptValueChange = (value: string) => {
        setNPromptValue(value);
    };

    const handleSecondsValueChange = (value: string) => {
        setSecondsValue(value);
        setSecondsErrorMessage('')
    };
    const handleGotoVideo = async () => {
        router.push(`/video/${vidOutput?.id}`);

    }

    const generateVideo = async (e: PressEvent) => {
        setErrorMessage('')
        setIsLoading(false)
        setVidOutput(null)

        const pPrompt = pPromptValue
        if (pPrompt.length === 0) {
            setNPromoptErrorMessage('Please set prompt message')
            return
        }
        const seconds = parseInt(secondsValue)
        if (isNaN(seconds) || seconds <= 0) {
            setSecondsErrorMessage('Please enter valid seconds.')
            return
        }

        setIsLoading(true);
        const params: Txt2vidInput = {
            pPrompt: pPrompt,
            nPrompt: nPromptValue,
            seconds: seconds,
            scheduler: Txt2VidSchedulers.UniPCMultistepScheduler
        }

        try {
            const vid = await API.txt2vid(params);
            setVidOutput(vid)
        }
        catch (error: any) {
            setErrorMessage(error.message || 'Something went wrong.')
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <section>
                <Card>
                    <CardHeader>
                        <h1>Text to Video</h1>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <Textarea
                            label='Prompt'
                            placeholder=''
                            className='max-w'
                            value={pPromptValue}
                            errorMessage={nPromoptErrorMessage}
                            onValueChange={handlePPromptValueChange}
                        />
                        <Spacer y={4} />
                        <Textarea
                            label='Negative Prompt'
                            placeholder=''
                            className='max-w'
                            value={nPromptValue}
                            onValueChange={handleNPromptValueChange}
                        />
                        <Spacer y={4} />
                        <Input
                            label='Seconds'
                            type='number'
                            value={secondsValue}
                            onValueChange={handleSecondsValueChange}
                            errorMessage={secondsErrorMessage}
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
            </section>
            <Modal isOpen={vidOutput != null} isDismissable={false}>
                <ModalContent>
                    <ModalHeader>Cooking</ModalHeader>
                    <ModalBody>
                        Your video is in the works, should be ready in about {vidOutput?.eta} minutes!
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={handleGotoVideo}>
                            Checkout the video
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
