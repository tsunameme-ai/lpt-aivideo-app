import { GenerationType } from "@/libs/types"

export class API {

    public async generateVideo(imageUrl: string, width: string, height: string) {
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                cache: 'no-cache',
                body: JSON.stringify({
                    type: GenerationType.IMG2VID, input: {
                        imageUrl: imageUrl,
                        width: parseInt(width),
                        height: parseInt(height),
                        motionButcketId: parseInt(motionBucketId),
                        noiseAugStrength: parseFloat(noiseAugStrength),
                        seed: seed
                    }
                }),
            })
            const generationRequest = await response.json()
            if (generationRequest) {
                setImg2VidRequest(generationRequest)
                setIsGeneratingVideo(true)
            }
            else {
                throw new Error('Unable to generate request')
            }
        }
        catch (e: any) {
            setErrorMessage(`Unable to generate video: ${e.message}`)
            setIsGeneratingVideo(false)
        }
    }
}