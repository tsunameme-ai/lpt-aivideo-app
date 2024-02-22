'use client'
import { LocalImageData, GenerationOutput, Txt2imgInput } from '@/libs/types';
import { createContext, useState, useEffect, useContext } from 'react';

interface GenerationContextType {
    isAdvancedView: boolean
    setIsAdvancedView: (value: boolean) => void

    t2iInput: Txt2imgInput | undefined
    setT2iInput: (value: Txt2imgInput | undefined) => void
    t2iOutputs: Array<GenerationOutput>
    setT2iOutputs: (outputs: Array<GenerationOutput>) => void
    // get t2iSelectedOutput(): GenerationOutput | undefined
    t2iOutputSelectedIndex: number
    setT2iOutputSelectedIndex: (value: number) => void
    coverText: string
    setCoverText: (value: string) => void
    coverImageData: LocalImageData | undefined
    setCoverImageData: (value: LocalImageData | undefined) => void
    videoWidth: number
    setVideoWidth: (value: number) => void
    videoHeight: number
    setVideoHeight: (value: number) => void
    videoSeed: number
    setVideoSeed: (value: number) => void
    videoNoiseAugStrength: number
    setVideoNoiceAugStrength: (value: number) => void
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export default function GenerationContextProvider({ children }: { children: React.ReactNode }) {
    const [isAdvancedView, setIsAdvancedView] = useState<boolean>(false)
    const [t2iInput, setT2iInput] = useState<Txt2imgInput | undefined>(undefined)
    const [t2iOutputs, setT2iOutputs] = useState<Array<GenerationOutput>>([])
    const [t2iOutputSelectedIndex, setT2iOutputSelectedIndex] = useState<number>(0)
    const [coverText, setCoverText] = useState<string>('')
    const [coverImageData, setCoverImageData] = useState<LocalImageData | undefined>(undefined)
    const [videoWidth, setVideoWidth] = useState<number>(0)
    const [videoHeight, setVideoHeight] = useState<number>(0)
    const [videoSeed, setVideoSeed] = useState<number>(0)
    const [videoNoiseAugStrength, setVideoNoiseAugStrength] = useState<number>(0)

    useEffect(() => {
        // Optional: Clear context on unmount (comment out if not needed)
        return () => {
            console.log(`--Clear context on unmount--`)
            setT2iInput(undefined)
        };
    }, []);

    // const calculateSelectedOutput = (): GenerationOutput | undefined => {
    //     return t2iOutputs.length > t2iOutputSelectedIndex ? t2iOutputs[t2iOutputSelectedIndex] : undefined
    // };

    return (
        <GenerationContext.Provider
            value={{
                isAdvancedView, setIsAdvancedView,
                t2iInput, setT2iInput,
                t2iOutputs, setT2iOutputs,
                t2iOutputSelectedIndex, setT2iOutputSelectedIndex,
                // get selectedOutput() {
                //     return calculateSelectedOutput();
                // },
                coverText, setCoverText,
                coverImageData, setCoverImageData,
                videoWidth, setVideoWidth,
                videoHeight, setVideoHeight,
                videoSeed, setVideoSeed,
                videoNoiseAugStrength, setVideoNoiseAugStrength
            }}>
            {children}
        </GenerationContext.Provider>
    )

}
export function useGenerationContext() {
    const context = useContext(GenerationContext)
    if (!context) {
        throw new Error(`Gerneration Context is not defined.`)
    }
    return context
}