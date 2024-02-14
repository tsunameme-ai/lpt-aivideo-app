import { GenerationOutput } from '../types'
import { Utils } from '../utils'

export class LivepeerStaticAPI {
    public async txt2img(): Promise<Array<GenerationOutput>> {
        await Utils.delay(1000)
        return [{
            id: 'static',
            status: 'success',
            mediaUrl: 'https://1pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/0-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }, {
            id: 'static',
            status: 'success',
            mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/1-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }, {
            id: 'static',
            status: 'success',
            mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/2-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }, {
            id: 'static',
            status: 'success',
            mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/3-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }]
    }

    public async img2vid(): Promise<Array<GenerationOutput>> {
        await Utils.delay(10000)
        return [{
            id: 'static',
            status: 'success',
            mediaUrl: 'https://storage.googleapis.com/livepeer-ai-video-dev/682fb4f9/962d54e5.mp4'
        }]
    }
}