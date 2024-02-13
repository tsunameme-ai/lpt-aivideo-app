'use client'
import { GenerationOutput, Txt2imgInput } from '@/libs/types';
import { createContext, useState, useEffect, useContext } from 'react';

interface GenerationContextType {
    isAdvancedView: boolean
    setIsAdvancedView: (value: boolean) => void

    t2iInput: Txt2imgInput | undefined
    setT2iInput: (value: Txt2imgInput | undefined) => void
    t2iOutputs: Array<GenerationOutput>
    setTi2Outputs: (outputs: Array<GenerationOutput>) => void
    t2iOutputSelectedIndex: number
    setT2iOutputSelectedIndex: (value: number) => void
    coverImageDataURL: string | undefined,
    setCoverImageDataURL: (value: string | undefined) => void
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export default function GenerationContextProvider({ children }: { children: React.ReactNode }) {
    const [isAdvancedView, setIsAdvancedView] = useState<boolean>(false)
    const [t2iInput, setT2iInput] = useState<Txt2imgInput | undefined>(undefined)
    const [t2iOutputs, setT2iOutputs] = useState<Array<GenerationOutput>>([])
    const [t2iOutputSelectedIndex, setT2iOutputSelectedIndex] = useState<number>(0)
    const [coverImageDataURL, setCoverImageDataURL] = useState<string | undefined>(undefined)

    useEffect(() => {
        // Optional: Clear context on unmount (comment out if not needed)
        return () => {
            console.log(`--Clear context on unmount--`)
            setT2iInput(undefined)
        };
    }, []);
    return (
        <GenerationContext.Provider
            value={{
                isAdvancedView, setIsAdvancedView,
                t2iInput, setT2iInput,
                t2iOutputs, setT2iOutputs,
                t2iOutputSelectedIndex, setT2iOutputSelectedIndex,
                coverImageDataURL, setCoverImageDataURL
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