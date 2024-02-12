import { SDProvider } from "./types"

export default function getSDProvider(): SDProvider {
    const providers: { [key: string]: SDProvider } = {
        'livepeer': {
            'models': [
                { value: 'stabilityai/sd-turbo', label: 'Stable Diffusion Turbo' },
                { value: 'runwayml/stable-diffusion-v1-5', label: 'Stable Diffusion v1.5', default: true },
                { value: 'stabilityai/sdxl-turbo', label: 'SDXL Turbo' },
                { value: 'stabilityai/stable-diffusion-xl-base-1.0', label: 'SDXL 1.0' },
                { value: 'prompthero/openjourney-v4', label: 'MidJourney V4' }
            ]
        }
    }
    return providers['livepeer']
}