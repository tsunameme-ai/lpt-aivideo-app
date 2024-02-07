import { LivepeerAPI } from './external/livepeer';
import { ModelsLabAPI } from './external/modelslab';
import { Img2vidInput, Txt2imgInput, Txt2vidInput, GenerationOutput } from './types';

export class API {

    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static async txt2vid(params: Txt2vidInput): Promise<GenerationOutput> {
        return await ModelsLabAPI.txt2vid(params)
    }

    public static async img2vid(params: Img2vidInput): Promise<GenerationOutput> {
        return await new LivepeerAPI().img2vid(params)
    }

    public static async txt2img(params: Txt2imgInput): Promise<GenerationOutput> {
        if (process.env.NEXT_PUBLIC_SD_PROVIDER === 'modelslab') {
            return await ModelsLabAPI.txt2img(params)
        }
        return await new LivepeerAPI().txt2img(params)
    }

    public static async fetchRemoteFile(url: string): Promise<File> {
        const response = await fetch(url, { cache: 'no-cache' })
        const blob = await response.blob()
        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' })
        return file

    }
}