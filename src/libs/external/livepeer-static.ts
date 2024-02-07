import { GenerationOutput } from '../types'
import { Utils } from '../utils'

export class LivepeerStaticAPI {
    public async txt2img(): Promise<GenerationOutput> {
        await Utils.delay(1000)
        return {
            id: 'static',
            status: 'success',
            mediaUrl: 'https://storage.googleapis.com/livepeer-ai-video-dev/9b5b84ca/ddb52e75.png'
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
        await Utils.delay(1000)
        return {
            id: 'static',
            status: 'sucuess',
            mediaUrl: 'https://storage.googleapis.com/livepeer-ai-video-dev/56e47db3/da5d6de0.mp4'
        }
    }
}