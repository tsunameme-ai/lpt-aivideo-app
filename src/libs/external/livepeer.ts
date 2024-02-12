import { GenerationOutput, Img2vidInput, Txt2imgInput } from '../types'

export class LivepeerAPI {

    public async txt2img(params: Txt2imgInput): Promise<Array<GenerationOutput>> {
        const url = `${process.env.NEXT_PUBLIC_LIVEPEER_ENDPOINT}/text-to-image`
        const postBody = {
            'model_id': params.modelId,
            'prompt': params.pPrompt,
            'negative_prompt': params.nPrompt,
            'guidance_scale': params.guidanceScale,
            'seed': params.seed,
            'width': params.width,
            'height': params.height,
            'num_images_per_prompt': params.numOutput
        }
        return await this.sendRequest(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postBody)
        })
    }

    public async fetchAsset(mediaUrl: string): Promise<GenerationOutput> {
        return {
            id: 'sync',
            status: 'success',
            mediaUrl: mediaUrl
        }
    }

    public async img2vid(params: Img2vidInput): Promise<Array<GenerationOutput>> {
        const imageFile = params.imageFile
        if (!imageFile) {
            throw new Error(`SD Provider Error: image file does not exist.`)
        }
        const fd = new FormData()
        fd.append('image', imageFile)
        fd.append('model_id', 'stabilityai/stable-video-diffusion-img2vid-xt')
        fd.append('motion_bucket_id', params.motionButcketId.toString())
        fd.append('noise_aug_strength', params.noiseAugStrength.toString())

        const url = `${process.env.NEXT_PUBLIC_LIVEPEER_ENDPOINT}/image-to-video`
        return await this.sendRequest(url, {
            cache: 'no-cache',
            method: 'POST',
            body: fd,
        }, 600000)
    }

    private async sendRequest(url: string, init: RequestInit, timeoutMs: number = 40000): Promise<Array<GenerationOutput>> {
        const t = new Date().getTime()
        let resError
        let resOutput
        let status

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const res = await fetch(url, { ...init, signal: controller.signal })
            // console.log(res)
            clearTimeout(timeoutId)
            // const res = await fetch(url, init)
            status = res.status
            resOutput = await this.parseResponse(res)
        }
        catch (e: any) {
            console.log(e)
            resError = e
            status = e.status || 'ERROR'
        }
        finally {
            clearTimeout(timeoutId)
            const dur = (new Date().getTime() - t) / 1000
            const segs = url.split('/')
            console.log(`LIVEPEER REQ ${status} ${segs[segs.length - 1]} ${dur}`)
            if (resError) {
                throw resError
            }
            return resOutput!
        }
    }

    private async parseResponse(res: Response): Promise<Array<GenerationOutput>> {
        if (res.ok) {
            const data = await res.json()
            return data.images.map(item => {
                return {
                    id: 'sync',
                    status: 'success',
                    mediaUrl: item.url,
                    seed: item.seed
                }
            })
        }
        let errorMessage = ''
        try {
            const data = await res.json()
            errorMessage = data.error?.message || ''
        }
        catch (e) {
        }
        finally {
            throw new Error(`SD Provider Error: ${res.status} ${errorMessage}`)
        }
    }
}