import { Img2vidInput, Txt2imgInput, Txt2vidInput, VideoGenerationOutput } from '../types'

export class ModelsLabAPI {
    // https://docs.modelslab.com/text-to-video/texttovideo
    public static async txt2vid(params: Txt2vidInput): Promise<VideoGenerationOutput> {
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
        console.log(data)
        return {
            id: data.id,
            status: data.status,
            mediaUrl: decodeURI(data.output[0])
        }
    }

    // https://docs.modelslab.com/text-to-video/imgtovideo
    public static async img2vid(params: Img2vidInput): Promise<VideoGenerationOutput> {
        const url = 'https://modelslab.com/api/v6/video/img2video'
        // const postBody = {
        //     'model_id': 'svd',
        //     'init_image': params.image,
        //     'heigh': 320,
        //     'width': 576,
        //     'num_frames': params.seconds * 6,
        //     'num_inference_steps': 20,
        //     'motion_bucket_id': params.motionButcketId,
        //     'noise_aug_strength': 0.02
        // }
        const postBody = {
            'model_id': 'svd',
            'init_image': 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/2231684321704267390.png',
            'num_frames': 100,
            'num_inference_steps': 20,
            'fps': 10,
            'output_type': 'mp4',
            'min_guidance_scale': 1,
            'max_guidance_scale': 3,
            'motion_bucket_id': 200,
            'noise_aug_strength': 0.02,
            'base64': false,
            'webhook': null,
            'track_id': null
        }

        const data = await ModelsLabAPI.makePostAPICall(url, postBody)
        console.log(data)
        return {
            id: data.id,
            status: data.status,
            mediaUrl: decodeURI(data.output[0])
        }
    }

    // https://docs.modelslab.com/stable-diffusion-api/text2img
    public static async txt2img(params: Txt2imgInput) {
        const url = 'https://modelslab.com/api/v6/images/text2img'
        const postBody = {
            'model_id': params.modelId,
            'prompt': params.pPrompt,
            'negative_prompt': params.nPrompt,
            'num_inference_steps': params.steps,
            'width': '512',
            'height': '512',
            // 'samples': '1',
            // 'num_inference_steps': '30',
            // 'seed': null,
            // 'guidance_scale': 7.5,
            // 'webhook': null,
            // 'track_id': null
        }

        const data = await ModelsLabAPI.makePostAPICall(url, postBody)
        console.log(data)
        return {
            id: data.id,
            status: data.status,
            mediaUrl: decodeURI(data.output[0])
        }
    }

    public static async fetchAsset(vid: string): Promise<VideoGenerationOutput> {
        const url = `https://modelslab.com/api/v6/video/fetch/${vid}`
        const data = await ModelsLabAPI.makePostAPICall(url, { 'request_id': vid })
        console.log(data)
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