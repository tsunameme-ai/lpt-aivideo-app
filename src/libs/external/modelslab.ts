import { Txt2imgInput, Txt2vidInput, GenerationOutput } from '../types'

export class ModelsLabAPI {
    // https://docs.modelslab.com/text-to-video/texttovideo
    public static async txt2vid(params: Txt2vidInput): Promise<GenerationOutput> {
        const url = 'https://stablediffusionapi.com/api/v5/text2video'
        const postBody = {
            'prompt': params.pPrompt,
            'negative_prompt': params.nPrompt,
            'scheduler': 'UniPCMultistepScheduler',
            'seconds': params.seconds
        }
        // const url = 'https://modelslab.com/api/v6/video/text2video'
        // const postBody = {
        //     'model_id': 'zeroscope',
        //     'prompt': params.pPrompt,
        //     'negative_prompt': params.nPrompt,
        //     'heigh': 320,
        //     'width': 576,
        //     'num_frames': params.seconds * 6,
        //     'num_inference_steps': 20,
        //     // 'seed': params.seed || -1,
        // }
        const data = await ModelsLabAPI.makePostAPICall(url, postBody)
        // console.log(data)
        return {
            id: data.id,
            status: data.status,
            mediaUrl: decodeURI(data.output[0])
        }
    }

    // https://docs.modelslab.com/stable-diffusion-api/text2img
    public static async txt2img(params: Txt2imgInput): Promise<GenerationOutput> {
        const url = 'https://modelslab.com/api/v6/images/text2img'
        const postBody: any = {
            'model_id': params.modelId,
            'prompt': params.pPrompt,
            'negative_prompt': params.nPrompt,
            'num_inference_steps': params.steps,
            'width': params.width,
            'height': params.height,
            'seed': params.seed ? parseInt(params.seed) : undefined,
            'clip_skip': params.clipSkip,
            'guidance_scale': params.guidanceScale,
            'lora_model': params.loraModel,
            'lora_strength': params.loraModel === undefined ? undefined : params.loraStrength,
            'scheduler': params.scheduler
            // 'webhook': null,
            // 'track_id': null
        }

        const data = await ModelsLabAPI.makePostAPICall(url, postBody)
        // console.log(data)
        return {
            id: data.id,
            status: data.status,
            mediaUrl: decodeURI(data.output[0])
        }
    }

    public static async fetchAsset(vid: string): Promise<GenerationOutput> {
        const url = `https://modelslab.com/api/v6/video/fetch/${vid}`
        const data = await ModelsLabAPI.makePostAPICall(url, { 'request_id': vid })
        // console.log(data)
        if (data.status === 'error') {
            throw new Error(data.message)
        }
        return {
            id: vid.toString(),
            status: data.status,
            mediaUrl: decodeURI(data.output[0])
        }
    }


    private static async makePostAPICall(url: string, postBody: any) {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        const postData = JSON.stringify({
            ...postBody,
            'key': process.env.NEXT_PUBLIC_TXT2VID_APIKEY!,
        })

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: postData,
            redirect: 'follow'
        })
        const data = await response.json()
        if (['error', 'failed'].includes(data.status)) {
            throw new Error(data.response?.message || data.message || 'Unable to process txt2vid request.')
        }
        return data
    }
}