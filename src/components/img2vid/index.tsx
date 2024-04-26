import { SDConfig } from "@/libs/types"
import { Input, Select, SelectItem, Spacer } from "@nextui-org/react"
import { useState } from "react"

interface Img2VidComponentProps {
    width: number
    height: number,
    motionBucketId: number
    noiseAugStrength: number
    modelId: string
    sdConfig: SDConfig
    seed?: number
    onI2VInputChange?: (w: number, h: number, mbi: number, nas: number, seed: number | undefined, modelId: string) => void
}

const Img2VidComponent: React.FC<Img2VidComponentProps> = (props: Img2VidComponentProps) => {
    const [modelId, setModelId] = useState<string>(props.modelId)
    const [width, setWidth] = useState<string>(props.width.toString())
    const [height, setHeight] = useState<string>(props.height.toString())
    const [motionBucketId, setMotionBucketId] = useState<string>(props.motionBucketId.toString())
    const [noiseAugStrength, setNoiseAugStrength] = useState<string>(props.noiseAugStrength.toString())
    const [seed, setSeed] = useState<string>(props.seed ? props.seed.toString() : '')

    const updateHeight = (v: string) => {
        setHeight(v)
        props.onI2VInputChange?.(parseInt(width), parseInt(v), parseInt(motionBucketId), parseFloat(noiseAugStrength), seed ? parseInt(seed) : undefined, modelId)
    }

    const updateWidth = (v: string) => {
        setWidth(v)
        props.onI2VInputChange?.(parseInt(v), parseInt(height), parseInt(motionBucketId), parseFloat(noiseAugStrength), seed ? parseInt(seed) : undefined, modelId)
    }

    const updateSeed = (v: string) => {
        setSeed(v)
        props.onI2VInputChange?.(parseInt(width), parseInt(height), parseInt(motionBucketId), parseFloat(noiseAugStrength), parseInt(v), modelId)
    }

    const updateMotionBucketId = (v: string) => {
        setMotionBucketId(v)
        props.onI2VInputChange?.(parseInt(width), parseInt(height), parseInt(motionBucketId), parseFloat(v), seed ? parseInt(seed) : undefined, modelId)
    }

    const updateNoiseAugStrength = (v: string) => {
        setNoiseAugStrength(v)
        props.onI2VInputChange?.(parseInt(width), parseInt(height), parseInt(motionBucketId), parseFloat(v), seed ? parseInt(seed) : undefined, modelId)
    }
    const handleSelectModel = (key: any) => {
        const mid = key.size === 0 ? undefined : key.currentKey
        setModelId(mid)
        props.onI2VInputChange?.(parseInt(width), parseInt(height), parseInt(motionBucketId), parseFloat(noiseAugStrength), seed ? parseInt(seed) : undefined, mid)
    }

    return (
        <section className='flex flex-col items-center justify-center'>
            <Spacer y={4} />
            <div className='grid grid-cols-2 gap-4'>
                <Input
                    isDisabled={true}
                    label='Width'
                    type='number'
                    value={width}
                    onValueChange={updateWidth} />
                <Input
                    isDisabled={true}
                    label='Height'
                    type='number'
                    value={height}
                    onValueChange={updateHeight} />
                {props.sdConfig.videoModels &&
                    <Select
                        defaultSelectedKeys={[props.modelId]}
                        value={[modelId || '']}
                        onSelectionChange={handleSelectModel}
                        label='Model'>
                        {props.sdConfig.videoModels.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </Select>}
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
            </div>

        </section>
    );
};

export default Img2VidComponent