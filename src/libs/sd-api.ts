import { GenerationOutputItem, Img2vidInput, Txt2imgInput } from './types'
import { Utils } from './utils'

export class SDAPI {
    public static resizeToFit = (width: number, height: number, maxWidth: number, maxHeight: number): { width: number; height: number } => {
        const limitingDimension = Math.max(width / maxWidth, height / maxHeight);
        const newWidth = Math.floor(width / limitingDimension) & ~7; // Ensure divisibility by 8
        const newHeight = Math.floor(height / limitingDimension) & ~7;
        return { width: newWidth, height: newHeight };
    }

    public async txt2img(params: Txt2imgInput): Promise<Array<GenerationOutputItem>> {
        const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/text-to-image`
        const postBody = {
            'model_id': params.modelId,
            'prompt': params.pPrompt,
            'negative_prompt': params.nPrompt,
            'guidance_scale': params.guidanceScale,
            'seed': params.seed,
            'width': params.width,
            'height': params.height,
            'num_images_per_prompt': params.numOutput,
            "user_id": params.userId
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

    public async img2vid(params: Img2vidInput): Promise<Array<GenerationOutputItem>> {
        const postBody = {
            "image_url": params.imageUrl,
            "model_id": params.modelId,
            "width": params.width,
            "height": params.height,
            "motion_bucket_id": params.motionBucketId,
            "noise_aug_strength": params.noiseAugStrength,
            "overlay_base64": params.overlayBase64,
            "overlay_text": params.overlayText,
            "image_generation_id": params.imageGenerationId,
            "output_width": 256,
            "user_id": params.userId
        }
        const url = process.env.NEXT_PUBLIC_API_ENDPOINT_IMG2VID!
        return await this.sendRequest(url, {
            cache: 'no-cache',
            method: 'POST',
            body: JSON.stringify(postBody)
        }, 600000)
    }

    private async sendRequest(url: string, init: RequestInit, timeoutMs: number = 40000): Promise<Array<GenerationOutputItem>> {
        const t = new Date().getTime()
        let resError
        let resOutput
        let status

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const res = await fetch(url, { ...init, signal: controller.signal })
            clearTimeout(timeoutId)
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
            console.log(`SDAPI REQ ${status} ${segs[segs.length - 1]} ${dur}`)
            if (resError) {
                throw resError
            }
            return resOutput!
        }
    }

    private async parseResponse(res: Response): Promise<Array<GenerationOutputItem>> {
        if (res.ok) {
            const data = await res.json()
            if (data && data.images) {
                return data.images.map((item: { url: string, seed?: number }, index: number) => {
                    return {
                        id: `${data.id}:${index}`,
                        url: item.url,
                        seed: item.seed
                    }
                })
            }
            else {
                throw new Error(`Empty data`)
            }
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

export class SDStaticAPI {
    public async txt2img(): Promise<Array<GenerationOutputItem>> {
        await Utils.delay(1000)
        return [{
            id: 'static',
            seed: 1773116098,
            url: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/0-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }, {
            id: 'static',
            seed: 1773116098,
            url: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/1-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }, {
            id: 'static',
            seed: 1773116098,
            url: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/2-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }, {
            id: 'static',
            seed: 1773116098,
            url: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/3-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }]

    }

    public async img2vid(): Promise<Array<GenerationOutputItem>> {
        await Utils.delay(10000)
        return [{
            id: 'static',
            // url: 'https://lpt-aivideo-dst.s3.amazonaws.com/T1EjNmQU2x.gif',
            url: 'https://lpt-aivideo-dst.s3.amazonaws.com/CZrV2ezwGx.gif',
            seed: 1773116098
        }]
    }
}