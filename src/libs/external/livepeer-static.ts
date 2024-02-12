import { GenerationOutput } from '../types'
import { Utils } from '../utils'

export class LivepeerStaticAPI {
    public async txt2img(): Promise<GenerationOutput> {
        await Utils.delay(1000)
        return {
            id: 'static',
            status: 'success',
            mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/2-35da8614-aadf-4e43-bf1f-e7c0daca0fb7.png'
        }
    }

    public async fetchAsset(mediaUrl: string): Promise<GenerationOutput> {
        return {
            id: 'static',
            status: 'success',
            mediaUrl: mediaUrl
        }
    }

    public async img2vid(): Promise<GenerationOutput> {
        await Utils.delay(10000)
        return {
            id: 'static',
            status: 'success',
            mediaUrl: 'https://storage.googleapis.com/livepeer-ai-video-dev/56e47db3/da5d6de0.mp4'
        }
    }
}