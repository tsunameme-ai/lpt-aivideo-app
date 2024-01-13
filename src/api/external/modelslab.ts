import { Img2vidInput, Txt2vidInput, VideoGenerationOutput } from '../types';

export class ModelsLabAPI {
    // https://docs.modelslab.com/text-to-video/texttovideo
    public static async txt2vid(params: Txt2vidInput): Promise<VideoGenerationOutput> {
        const url = 'https://modelslab.com/api/v6/video/text2video'
        const postBody = {
            'model_id': 'zeroscope',
            'prompt': params.pPrompt,
            'negative_prompt': params.nPrompt,
            'heigh': 320,
            'width': 576,
            'num_frames': params.seconds * 6,
            'num_inference_steps': 20,
            // 'seed': params.seed || -1,
        }
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
        const postBody = {
            'model_id': 'svd',
            'init_image': params.image,
            'heigh': 320,
            'width': 576,
            'num_frames': params.seconds * 6,
            'num_inference_steps': 20,
            'motion_bucket_id': params.motionButcketId,
            'noise_aug_strength': 0.02
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
    //TODO txt2img

    public static async fetchVideo(vid: string): Promise<VideoGenerationOutput> {
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
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
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