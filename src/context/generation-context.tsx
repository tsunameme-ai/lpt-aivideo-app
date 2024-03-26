'use client'
import { LocalImageData, GenerationOutputItem, Txt2imgInput, Img2vidInput, SDConfig } from '@/libs/types';
import { createContext, useState, useEffect, useContext } from 'react';

interface GenerationContextType {
    config: SDConfig
    isAdvancedView: boolean
    setIsAdvancedView: (value: boolean) => void

    t2iInput: Txt2imgInput | undefined
    setT2iInput: (value: Txt2imgInput | undefined) => void
    t2iOutputs: Array<GenerationOutputItem>
    setT2iOutputs: (outputs: Array<GenerationOutputItem>) => void

    t2iOutputSelectedIndex: number
    setT2iOutputSelectedIndex: (value: number) => void

    get t2iSelectedOutput(): GenerationOutputItem | undefined

    overlayText: string
    setOverlayText: (value: string) => void
    overlayImageData: LocalImageData | undefined
    setOverlayImageData: (value: LocalImageData | undefined) => void

    i2vInput: Img2vidInput | undefined
    setI2vInput: (value: Img2vidInput | undefined) => void
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export default function GenerationContextProvider({ children }: { children: React.ReactNode }) {
    const [isAdvancedView, setIsAdvancedView] = useState<boolean>(false)
    const [t2iInput, setT2iInput] = useState<Txt2imgInput | undefined>(undefined)
    const [t2iOutputs, setT2iOutputs] = useState<Array<GenerationOutputItem>>([])
    const [t2iOutputSelectedIndex, setT2iOutputSelectedIndex] = useState<number>(0)
    const [overlayText, setOverlayText] = useState<string>('')
    const [overlayImageData, setOverlayImageData] = useState<LocalImageData | undefined>(undefined)
    const [i2vInput, setI2vInput] = useState<Img2vidInput | undefined>(undefined)

    useEffect(() => {
        // Optional: Clear context on unmount (comment out if not needed)
        return () => {
            console.log(`--Clear context on unmount--`)
            setT2iInput(undefined)
        };
    }, []);

    const generationConfig = (): SDConfig => {
        return {
            'models': [
                { value: 'ByteDance/SDXL-Lightning', label: 'SDXL Lightning', default: true },
                { value: 'ByteDance/SDXL-Lightning-4step', label: 'SDXL Lightning 4step' },
                { value: 'ByteDance/SDXL-Lightning-8step', label: 'SDXL Lightning 8step' },
                { value: 'stabilityai/sd-turbo', label: 'SD Turbo' },
                { value: 'runwayml/stable-diffusion-v1-5', label: 'SD v1.5', },
                { value: 'stabilityai/sdxl-turbo', label: 'SDXL Turbo' },
                { value: 'stabilityai/stable-diffusion-xl-base-1.0', label: 'SDXL 1.0' },
                // { value: 'prompthero/openjourney-v4', label: 'MidJourney V4' }
            ],
            'videoModels': [
                { value: 'stable-video-diffusion-img2vid-xt', label: 'SVD' },
                { value: 'stabilityai/stable-video-diffusion-img2vid-xt-1-1', label: 'SVD 1.1', default: true }
            ]
        }
    };

    const getT2iSelectedOutput = (): GenerationOutputItem | undefined => {
        if (t2iOutputs) {
            return t2iOutputs[t2iOutputSelectedIndex || 0]
        }
        return undefined
    }

    return (
        <GenerationContext.Provider
            value={{
                isAdvancedView, setIsAdvancedView,
                t2iInput, setT2iInput,
                t2iOutputs, setT2iOutputs,
                t2iOutputSelectedIndex, setT2iOutputSelectedIndex,
                get config() {
                    return generationConfig()
                },
                get t2iSelectedOutput() {
                    return getT2iSelectedOutput()
                },
                overlayText, setOverlayText,
                overlayImageData, setOverlayImageData,
                i2vInput, setI2vInput
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