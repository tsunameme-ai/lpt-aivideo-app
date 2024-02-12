import { GenerationOutput } from '../types'
import { Utils } from '../utils'

export class LivepeerStaticAPI {
    public async txt2img(): Promise<Array<GenerationOutput>> {
        await Utils.delay(1000)
        return [{
            id: 'static',
            status: 'success',
            mediaUrl: 'https://storage.googleapis.com/livepeer-ai-video-dev/d29f83fe/33761a91.png'
        }, {
            id: 'static',
            status: 'success',
            mediaUrl: 'https://storage.googleapis.com/livepeer-ai-video-dev/d29f83fe/19004b0a.png'
        }, {
            id: 'static',
            status: 'success',
            mediaUrl: 'https://storage.googleapis.com/livepeer-ai-video-dev/d29f83fe/90b6f235.png'
        }, {
            id: 'static',
            status: 'success',
            mediaUrl: 'https://storage.googleapis.com/livepeer-ai-video-dev/d29f83fe/61ab99bd.png'
        }]
    }

    public async fetchAsset(mediaUrl: string): Promise<Array<GenerationOutput>> {
        return [{
            id: 'static',
            status: 'success',
            mediaUrl: mediaUrl
        }]
    }

    public async img2vid(): Promise<Array<GenerationOutput>> {
        await Utils.delay(10000)
        return [{
            id: 'static',
            status: 'success',
            mediaUrl: 'https://storage.googleapis.com/livepeer-ai-video-dev/56e47db3/da5d6de0.mp4'
        }]
    }
}