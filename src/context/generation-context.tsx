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

    shufflePrompt(): string

    overlayText: string
    setOverlayText: (value: string) => void
    overlayImageData: LocalImageData | undefined
    setOverlayImageData: (value: LocalImageData | undefined) => void

    i2vInput: Img2vidInput | undefined
    setI2vInput: (value: Img2vidInput | undefined) => void
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
    const shufflePrompt = (): string => {
        //From https://civitai.com/images/1777449
        const prompts = [
            'photo realistic, ultra details, natural light ultra detailed portrait of a female necromancer, skeleton face volumetric fog, Hyperrealism, breathtaking, ultra realistic, ultra detailed, cyber background, cinematic lighting, highly detailed, breathtaking, photography, stunning environment, wide-angle", "text_l": "photo realistic, ultra details, natural light ultra detailed portrait of a female necromancer, skeleton face volumetric fog, Hyperrealism, breathtaking, ultra realistic, ultra detailed, cyber background, cinematic lighting, highly detailed, breathtaking, photography, stunning environment, wide-angle',
            'masterpiece, best quality, gorgeous pale american cute girl, smiling, (crop top), red hair loose braided hair, short polca skirt, lean against a tree, field, flowers smiling, perfectly symmetrical face, detailed skin, elegant, alluring, attractive, amazing photograph, masterpiece, best quality, 8K, high quality, photorealistic, realism, art photography, Nikon D850, 16k, sharp focus, masterpiece, breathtaking, atmospheric perspective, diffusion, pore correlation, skin imperfections, DSLR, 80mm Sigma f2, depth of field, intricate natural lighting, looking at camara',
            'cinematic still, filmed by Guillermo del Toro, Amidst a deep dark forest, an enigmatic being appears--an amalgamation of flora and fauna, with vines for hair, eyes gleaming like embers, and skin adorned with iridescent scales',
            'masterpiece, best quality, greg rutkowski, fire, no humans, open mouth, wings, dragon, sharp teeth, teeth, tail, solo, breathing fire, horns, monster, claws, smoke , very detailed, high resolution, sharp, sharp image, 4k, 8k',
            'Victorian man, London, (sharp focus:1.2), extremely detailed, (photorealistic:1.4), (RAW image, 8k high resolution:1.2), RAW candid cinema, 16mm, color graded Portra 400 film, ultra realistic, cinematic film still, subsurface scattering, ray tracing, (volumetric lighting)',
            'closeup of woman wearing gothic clothes, braided pigtails, in a castle, sharp focus, looking at the night time, Mystical atmosphere, cinematic',
            '"Cinematic still, filmed by Alfonso Cuar\u00f3n, wide-shot, a creature adorned with luminescent feathers that cascade like a vibrant waterfall, their iridescent glow casting an enchanting shimmer upon the surroundings, mythical creature had stepped into our world, exuding an aura of otherworldly beauty and intrigue',
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
    return (
        <GenerationContext.Provider
            value={{
                isAdvancedView, setIsAdvancedView,
                t2iOutputs, setT2iOutputs,
                t2iOutputSelectedIndex, setT2iOutputSelectedIndex,
                get config() {
                    return generationConfig()
                },
                shufflePrompt,
                get t2iSelectedOutput() {
                    return getT2iSelectedOutput()
                },
                overlayText, setOverlayText,
                overlayImageData, setOverlayImageData,
                i2vInput, setI2vInput,
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