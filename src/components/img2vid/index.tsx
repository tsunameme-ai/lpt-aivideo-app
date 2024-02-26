import { Input } from "@nextui-org/react"
import { useState } from "react"

interface Img2VidComponentProps {
    width: number
    height: number,
    motionBucketId: number
    noiseAugStrength: number
    seed?: number
    isAdvancedView: boolean
    onI2VInputChange?: (w: number, h: number, mbi: number, nas: number, seed: number | undefined) => void
}

const Img2VidComponent: React.FC<Img2VidComponentProps> = (props: Img2VidComponentProps) => {
    const [width, setWidth] = useState<string>(props.width.toString())
    const [height, setHeight] = useState<string>(props.height.toString())
    const [motionBucketId, setMotionBucketId] = useState<string>(props.motionBucketId.toString())
    const [noiseAugStrength, setNoiseAugStrength] = useState<string>(props.noiseAugStrength.toString())
    const [seed, setSeed] = useState<string>(props.seed ? props.seed.toString() : '')

    const updateHeight = (v: string) => {
        setHeight(v)
        props.onI2VInputChange?.(parseInt(width), parseInt(v), parseInt(motionBucketId), parseFloat(noiseAugStrength), seed ? parseInt(seed) : undefined)
    }

    const updateWidth = (v: string) => {
        setWidth(v)
        props.onI2VInputChange?.(parseInt(v), parseInt(height), parseInt(motionBucketId), parseFloat(noiseAugStrength), seed ? parseInt(seed) : undefined)
    }

    const updateSeed = (v: string) => {
        setSeed(v)
        props.onI2VInputChange?.(parseInt(width), parseInt(height), parseInt(motionBucketId), parseFloat(noiseAugStrength), parseInt(v))
    }

    const updateMotionBucketId = (v: string) => {
        setMotionBucketId(v)
        props.onI2VInputChange?.(parseInt(width), parseInt(height), parseInt(motionBucketId), parseFloat(v), seed ? parseInt(seed) : undefined)
    }

    const updateNoiseAugStrength = (v: string) => {
        setNoiseAugStrength(v)
        props.onI2VInputChange?.(parseInt(width), parseInt(height), parseInt(motionBucketId), parseFloat(v), seed ? parseInt(seed) : undefined)
    }

    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                <div>
                    {props.isAdvancedView &&
                        <div className='grid grid-cols-2 gap-4'>
                            <Input
                                label='Width'
                                type='number'
                                value={width}
                                onValueChange={updateWidth} />
                            <Input
                                label='Height'
                                type='number'
                                value={height}
                                onValueChange={updateHeight} />
                            <Input
                                label='Motion Bucket Id'
                                type='number'
                                value={motionBucketId}
                                onValueChange={updateMotionBucketId} />
                            <Input
                                label='Noise Aug Strength'
                                type='number'
                                value={noiseAugStrength}
                                onValueChange={updateNoiseAugStrength}
                            />
                            <Input
                                label='Seed'
                                type='number'
                                value={seed}
                                onValueChange={updateSeed}
                            />
                        </div>}
                </div>

            </section>

        </>
    );
};

export default Img2VidComponent