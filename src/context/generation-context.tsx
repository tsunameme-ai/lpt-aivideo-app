'use client'
import { LocalImageData, GenerationOutputItem, Img2vidInput, SDConfig } from '@/libs/types';
import { createContext, useState, useEffect, useContext } from 'react';

interface GenerationContextType {
    config: SDConfig
    isAdvancedView: boolean
    setIsAdvancedView: (value: boolean) => void
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

    i2vOutputs: Array<GenerationOutputItem>
    setI2vOutputs: (outputs: Array<GenerationOutputItem>) => void
    reset: () => void
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined)


const readFromStorage = (storage: Storage, key: string): any => {
    const localStorageValue = storage.getItem(key)
    if (localStorageValue) {
        try {
            return JSON.parse(localStorageValue);
        }
        catch (e) {
            console.log(`??? localStorageValue json error ${typeof (localStorageValue)} ${localStorageValue}`)
            return localStorageValue
        }
    } else {
        return undefined
    }
}
const writeToStorage = (storage: Storage, key: string, value: any) => {
    if ([null, undefined].includes(value)) {
        storage.removeItem(key)
    }
    else {
        storage.setItem(key, JSON.stringify(value));
    }

}
const useLocalStorage = (key: string, defaultValue: any) => {
    const [value, setValue] = useState(() => {
        if (typeof (window) === 'undefined') {
            return defaultValue
        }
        const localStorageValue = readFromStorage(window.localStorage, key)
        return localStorageValue || defaultValue
    });

    useEffect(() => {
        if (typeof (window) === 'undefined') {
            return
        }
        writeToStorage(localStorage, key, value)
    }, [key, value]);

    return [value, setValue];
}


export default function GenerationContextProvider({ children }: { children: React.ReactNode }) {
    const [isAdvancedView, setIsAdvancedView] = useLocalStorage('isAdvancedView', false)
    const [t2iOutputs, setT2iOutputs] = useLocalStorage('t2iOutputs', [])
    const [t2iOutputSelectedIndex, setT2iOutputSelectedIndex] = useLocalStorage('t2iOutputSelectedIndex', 0)
    const [overlayText, setOverlayText] = useLocalStorage('overlayText', '')
    const [overlayImageData, setOverlayImageData] = useLocalStorage('overlayImageData', undefined)
    const [i2vInput, setI2vInput] = useLocalStorage('i2vInput', undefined)
    const [i2vOutputs, setI2vOutputs] = useLocalStorage('i2vOutputs', [])

    const updateValueFromLocalStorage = (key: string) => {
        if (typeof (window) === 'undefined') {
            return
        }
        const localStorageValue = readFromStorage(localStorage, key)
        writeToStorage(localStorage, key, localStorageValue)

    }

    useEffect(() => {
        updateValueFromLocalStorage('isAdvancedView')
        updateValueFromLocalStorage('t2iOutputs')
        updateValueFromLocalStorage('t2iOutputSelectedIndex')
        updateValueFromLocalStorage('overlayText')
        updateValueFromLocalStorage('overlayImageData')
        updateValueFromLocalStorage('i2vInput')
        updateValueFromLocalStorage('i2vOutputs')
        // return () => {
        //     setT2iInput(undefined)
        // };
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
                { value: 'prompthero/openjourney-v4', label: 'MidJourney V4' }
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
    const reset = () => {
        setT2iOutputs([])
        setT2iOutputSelectedIndex(0)
        setOverlayText('')
        setOverlayImageData(undefined)
        setI2vInput(undefined)
    }
    return (
        <GenerationContext.Provider
            value={{
                isAdvancedView, setIsAdvancedView,
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
                i2vInput, setI2vInput,
                i2vOutputs, setI2vOutputs,
                reset
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