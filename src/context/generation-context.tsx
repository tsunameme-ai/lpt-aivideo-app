'use client'
import { LocalImageData, GenerationOutputItem, Img2vidInput, SDConfig } from '@/libs/types';
import { createContext, useState, useEffect, useContext } from 'react';
import ShortUniqueId from 'short-unique-id';

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

    shufflePrompt: () => string

    i2vInput: Img2vidInput | undefined
    setI2vInput: (value: Img2vidInput | undefined) => void

    i2vOutputs: Array<GenerationOutputItem>
    setI2vOutputs: (outputs: Array<GenerationOutputItem>) => void

    userSalt: string
    isReady: boolean

    reset: () => void

    //App installation 
    installPromtEvt: Event | undefined
    requestAppInstall: () => void
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
    const [isReady, setIsReady] = useState<boolean>(false)
    const [isAdvancedView, setIsAdvancedView] = useLocalStorage('isAdvancedView', false)
    const [t2iOutputs, setT2iOutputs] = useLocalStorage('t2iOutputs', [])
    const [t2iOutputSelectedIndex, setT2iOutputSelectedIndex] = useLocalStorage('t2iOutputSelectedIndex', 0)
    const [overlayText, setOverlayText] = useLocalStorage('overlayText', '')
    const [overlayImageData, setOverlayImageData] = useLocalStorage('overlayImageData', undefined)
    const [i2vInput, setI2vInput] = useLocalStorage('i2vInput', undefined)
    const [i2vOutputs, setI2vOutputs] = useLocalStorage('i2vOutputs', [])
    const [userSalt] = useLocalStorage('userSalt', new ShortUniqueId({ length: 6 }).rnd())
    const [installPromtEvt, setInstallPromtEvt] = useState<Event | undefined>(undefined)

    const updateValueFromLocalStorage = (key: string) => {
        if (typeof (window) === 'undefined') {
            return
        }
        const localStorageValue = readFromStorage(localStorage, key)
        writeToStorage(localStorage, key, localStorageValue)

    }
    const handleBeforeInstallPromptEvt = (evt: Event) => {
        evt.preventDefault()
        setInstallPromtEvt(evt)
    }

    useEffect(() => {
        updateValueFromLocalStorage('isAdvancedView')
        updateValueFromLocalStorage('t2iOutputs')
        updateValueFromLocalStorage('t2iOutputSelectedIndex')
        updateValueFromLocalStorage('overlayText')
        updateValueFromLocalStorage('overlayImageData')
        updateValueFromLocalStorage('i2vInput')
        updateValueFromLocalStorage('i2vOutputs')
        updateValueFromLocalStorage('userSalt')
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPromptEvt)
        setIsReady(true)
        return () => {
            setInstallPromtEvt(undefined)
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPromptEvt)
        }
    }, []);

    const generationConfig = (): SDConfig => {
        return {
            'models': [
                { value: 'SG161222/RealVisXL_V4.0_Lightning', label: 'RealVisXL', default: true },
                { value: 'ByteDance/SDXL-Lightning', label: 'SDXL Lightning' },
                { value: 'stabilityai/sdxl-turbo', label: 'SDXL Turbo' },
            ],
            'videoModels': [
                { value: 'stable-video-diffusion-img2vid-xt', label: 'SVD' },
                { value: 'stabilityai/stable-video-diffusion-img2vid-xt-1-1', label: 'SVD 1.1', default: true }
            ]
        }
    };
    const shufflePrompt = (): string => {
        const prompts = [
            "Kyoto Animation stylized anime mixed with tradition Chinese artworks~ A dragon flying at modern cyberpunk fantasy world. Cinematic Lighting, incredible details, aerial view",
            "A strikingly mystical creature, reminiscent of a large, magical monster, takes center stage in this vintagepunk artwork. The image, possibly a captivating painting or a carefully captured photograph, showcases an awe-inspiring big white creature with an ethereal aura. Its mottled shade of white encompasses a weathered yet mesmerizing appearance, emanating an air of enigmatic beauty.",
            "HDR photo of woman, spiral curls, long auburn hair, (freckles:0.6), beautiful low cut blouse, long skirt, sitting on a chair in a dark room, amazing smile, perfect eyes . High dynamic range, vivid, rich details, clear shadows and highlights, realistic, intense, enhanced contrast, highly detailed",
            "90's aesthetic, boy, Anime, spaceship, coca-cola",
            "hajime sorayama 80s retro futurism sci-fi concept contemporary illustration fantasy landscape sky clouds robot cyborg girl futuristic city skyline aurora borealis stars space ocean beach palm trees biome island night gliter sparkly metallic irridescent holographic neon (jacket miniskirt stockings high heels:1.5) uniform revealing pose long flowing hair",
            "I have nowhere to go in this destroyed world, digital illustration, emotionally profound, expressionism, dramatic, gloomy, dark, 8k, high quality",
            "Lots of bunnies smiling with flowers and hearts in the background",
            "A clown in a green suit is running away from a tornado",
            "A fit girl, athletic, wearing skirt and blue tanktop. She is standing in a park."
        ]
        return prompts[Math.floor(Math.random() * prompts.length)]

    }

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

    const requestAppInstall = async () => {
        if (installPromtEvt) {
            (installPromtEvt as any).prompt()
            const { outcome } = await (installPromtEvt as any).userChoice
            console.log(`??? outcome ${outcome}`)
            setInstallPromtEvt(undefined)
        }
    }
    return (
        <GenerationContext.Provider
            value={{
                isAdvancedView, setIsAdvancedView,
                t2iOutputs, setT2iOutputs,
                t2iOutputSelectedIndex, setT2iOutputSelectedIndex,
                shufflePrompt,
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
                userSalt,
                isReady,
                reset,
                installPromtEvt,
                requestAppInstall,
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
