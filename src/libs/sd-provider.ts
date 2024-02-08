import { SDProvider } from "./types"

export default function getSDProvider(): SDProvider {
    const providers: { [key: string]: SDProvider } = {
        'livepeer': {
            'models': [
                { value: 'stabilityai/sd-turbo', label: 'SD Turbo' },
                { value: 'runwayml/stable-diffusion-v1-5', label: 'SD v1.5', default: true },
                { value: 'stabilityai/stable-diffusion-xl-base-1.0', label: 'SDXL 1.0' },
                { value: 'prompthero/openjourney-v4', label: 'MidJourney V4' }
            ]
        },
        // 'modelslab': {
        //     'models': [
        //         { value: 'sd-1.5', label: 'Stable Diffusion v1.5', default: true },
        //         { value: 'sdxl', label: 'SDXL 1.0' },
        //         { value: 'midjourney', label: 'MidJourney V4' },
        //         { value: 'anything-v45-pruned-merge', label: 'Anything-v4.5-pruned-mergedVae' },
        //         // { value: 'lexica-aperture-v35-commu', label: 'Lexica Aperture V3.5 (Community Edition)8' },
        //     ],
        //     'loras': [
        //         { value: 'hunter-x-hunter-lora-styl', label: 'Hunter X Hunter' },//https://modelslab.com/models/hunter-x-hunter-lora-styl
        //         { value: 'superhero-comic', label: 'superhero-comic', baseModel: 'sd-1.5' }, //https://modelslab.com/models/superhero-comic https://civitai.com/models/189634/superheroamerican-comic
        //         { value: 'creature-vase-v10', label: 'Creature Vase v1.0' }, //https://modelslab.com/models/creature-vase-v10
        //         { value: 'better_face_xl', label: 'Better Face XL' }, //https://modelslab.com/models/better_face_xl https://civitai.com/models/126343/better-picture-more-details-lora
        //     ],
        //     'schedulers': [
        //         { value: 'DDPMScheduler', label: 'DDPM' },
        //         { value: 'DDIMScheduler', label: 'DDIM' },
        //         { value: 'PNDMScheduler', label: 'PNDM' },
        //         { value: 'LMSDiscreteScheduler', label: 'LMS' },
        //         { value: 'EulerDiscreteScheduler', label: 'Euler' },
        //         { value: 'EulerAncestralDiscreteScheduler', label: 'Euler a', default: true },
        //         { value: 'DPMSolverMultistepScheduler', label: 'DPM++ 2M' },
        //         { value: 'HeunDiscreteScheduler', label: 'Heun' },
        //         { value: 'KDPM2DiscreteScheduler', label: 'DPM2' },
        //         { value: 'DPMSolverSinglestepScheduler', label: 'DPM++ SDE' },
        //         { value: 'KDPM2AncestralDiscreteScheduler', label: 'DPM2 a' },
        //         { value: 'UniPCMultistepScheduler', label: 'UniPCMultistep' },
        //         { value: 'DDIMInverseScheduler', label: 'DDIMInverse' },
        //         { value: 'DEISMultistepScheduler', label: 'DEISMultistep' },
        //         { value: 'IPNDMScheduler', label: 'IPNDM' },
        //         { value: 'KarrasVeScheduler', label: 'KarrasVe' },
        //         { value: 'ScoreSdeVeScheduler', label: 'ScoreSdeVe' },
        //         { value: 'LCMScheduler', label: 'LCM' }
        //     ]
        // }
    }
    return providers['livepeer']
}