import { Img2vidInput } from "../types"

export class LivepeerAPI {
    public static async img2vid(params: Img2vidInput) {
        const imageFile = params.imageFile
        if (!imageFile) {
            throw new Error(`Livepeer API: image file does not exist.`)
        }
        const fd = new FormData()
        fd.append('image', imageFile)
        fd.append('model_id', 'stabilityai/stable-video-diffusion-img2vid-xt')
        fd.append('motion_bucket_id', params.motionButcketId.toString())

        const url = `${process.env.NEXT_PUBLIC_LIVEPEER_ENDPOINT}/image-to-video`
        const headers = new Headers()
        headers.append('Access-Control-Allow-Origin', '*')
        headers.append('Prefer', 'respond-async')
        console.log(`???? post livepeer ${url}`)
        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            mode: 'no-cors',
            body: fd,
        })
        console.log(res)

        return await res.json()
    }
}