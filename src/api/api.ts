import { ModelsLabAPI } from './external/modelslab';
import { Img2vidInput, Txt2vidInput, VideoGenerationOutput } from './types';

export class API {

    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static async txt2vid2(params: Txt2vidInput): Promise<VideoGenerationOutput> {
        await this.delay(1000)
        return {
            id: '65704373',
            status: 'processing',
            width: 576,
            height: 320,
            mediaUrl: 'https:\/\/pub-3626123a908346a7a8be8d9295f44e26.r2.dev\/generations\/0a14364c-278e-4754-8cb3-3ec807efe4a2.mp4',
            eta: 6
        }
    }

    public static async txt2vid(params: Txt2vidInput): Promise<VideoGenerationOutput> {
        return ModelsLabAPI.txt2vid(params)
    }

    public static async img2vid(params: Img2vidInput): Promise<VideoGenerationOutput> {
        return ModelsLabAPI.img2vid(params)
    }

    public static async fetchVideoStatic(vid: string): Promise<VideoGenerationOutput> {
        await this.delay(1000)
        return {
            id: vid.toString(),
            status: 'success',
            mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/37c09e3e-c1a4-4786-b211-934a84aadb27.gif'
        }
    }
    public static async fetchVideo(vid: string): Promise<VideoGenerationOutput> {
        return await ModelsLabAPI.fetchVideo(vid)
    }
}