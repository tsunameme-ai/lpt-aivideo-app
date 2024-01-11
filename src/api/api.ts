import { Txt2vidInput, Txt2vidOutput } from './types';

export class API {

    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    public static async txt2vid2(params: Txt2vidInput): Promise<Txt2vidOutput> {
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

    public static async txt2vid(params: Txt2vidInput): Promise<Txt2vidOutput> {
        const url = process.env.NEXT_PUBLIC_TXT2VID_ENDPOINT!

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const raw = JSON.stringify({
            'key': process.env.NEXT_PUBLIC_TXT2VID_APIKEY!,
            'prompt': params.pPrompt,
            'negative_prompt': params.nPrompt,
            'scheduler': 'UniPCMultistepScheduler',
            'seconds': params.seconds
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        })
        console.log(response)
        const data = await response.json()
        if (data.status === 'error') {
            throw new Error(data.message || 'Unable to process txt2vid request.')
        }
        console.log(data)
        // return data.id
        // return 'hello'
        return {
            id: data.id.toString(),
            status: data.status,
            width: data.meta.W,
            height: data.meta.H,
            mediaUrl: decodeURI(data.future_links[0]),
            eta: data.eta
        }
    }

    public static async fetchVideo(vid: string): Promise<Txt2vidOutput> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const raw = JSON.stringify({
            'key': process.env.NEXT_PUBLIC_TXT2VID_APIKEY!,
            'request_id': vid
        });

        const response = await fetch(process.env.NEXT_PUBLIC_FETCHVIDEO_ENDPOINT!, {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        })
        const data = await response.json()
        console.log(data)
        if (data.status === 'error') {
            throw new Error(data.message)
        }
        return {
            id: vid.toString(),
            status: data.status,
            mediaUrl: decodeURI(data.output[0])

        }
    }
}