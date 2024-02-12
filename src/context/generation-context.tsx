'use client'
import { GenerationOutput, Txt2imgInput } from '@/libs/types';
import { createContext, useState, useEffect, useContext } from 'react';

interface GenerationContextType {
    t2iInput: Txt2imgInput | undefined
    setT2iInput: (value: Txt2imgInput | undefined) => void
    t2iOutputs: Array<GenerationOutput>
    setT2iOutputs: (outputs: Array<GenerationOutput>) => void
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export default function GenerationContextProvider({ children }: { children: React.ReactNode }) {
    const [t2iInput, setT2iInput] = useState()
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
                t2iInput,
                setT2iInput,
                t2iOutputs,
                setT2iOutputs
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