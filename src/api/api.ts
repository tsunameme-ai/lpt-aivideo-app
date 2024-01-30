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
        return await LivepeerAPI.img2vid(params)
    }
    public static async txt2img(params: Txt2imgInput): Promise<GenerationOutput> {
        return await ModelsLabAPI.txt2img(params)
        // await this.delay(1000)
        // return {
        //     id: '70879411',
        //     status: 'processing',
        //     mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/0-42616bb3-e082-4cac-8629-4373651f33c0.png'
        // }
    }

    public static async fetchAsset(vid: string): Promise<GenerationOutput> {
        return await ModelsLabAPI.fetchAsset(vid)
    }

    public static async fetchRemoteFile(url: string): Promise<File> {
        const response = await fetch(url)
        const blob = await response.blob()
        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' })
        return file

    }
}