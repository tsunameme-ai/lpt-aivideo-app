import { GenerationOutput } from '../types'
import { Utils } from '../utils'

export class LivepeerStaticAPI {
    public async txt2img(): Promise<Array<GenerationOutput>> {
        await Utils.delay(1000)
        return [{
            mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/0-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }, {
            mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/1-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }, {
            mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/2-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }, {
            mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/3-5c5efe4b-ec74-4311-9ced-76cc38d80835.png'
        }]
    }

    public async img2vid(): Promise<Array<GenerationOutput>> {
        await Utils.delay(10000)
        return [{
            mediaUrl: 'https://storage.googleapis.com/livepeer-ai-video-dev/85cefa4c/236fe9c1.mp4'
            // mediaUrl: 'https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/944fd9f2-74d6-4367-b6ff-8ffb6c3a1482.mp4'
        }]
    }
}