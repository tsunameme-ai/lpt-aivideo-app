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
    coverImageData: LocalImageData | undefined,
    setCoverImageData: (value: LocalImageData | undefined) => void
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export default function GenerationContextProvider({ children }: { children: React.ReactNode }) {
    const [isAdvancedView, setIsAdvancedView] = useState<boolean>(false)
    const [t2iInput, setT2iInput] = useState<Txt2imgInput | undefined>(undefined)
    const [t2iOutputs, setT2iOutputs] = useState<Array<GenerationOutput>>([])
    const [t2iOutputSelectedIndex, setT2iOutputSelectedIndex] = useState<number>(0)
    const [coverImageData, setCoverImageData] = useState<LocalImageData | undefined>(undefined)

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
                coverImageData, setCoverImageData,
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