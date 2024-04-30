import { fetchAssetsByUser } from "@/actions/stable-diffusion"
import { DEFAULT_MOTION_BUCKET_ID, DEFAULT_NOISE_AUG_STRENGTH, DEFAULT_VIDEO_HEIGHT, DEFAULT_VIDEO_WIDTH, GenerationOutputItem, GenerationRequest, GenerationType, Img2vidInput } from "@/libs/types"
import { useState } from "react"
import { useGenerationContext } from '@/context/generation-context'
import ImageGrid from "../../components/image-grid"

export const LOCAL_USERID = 'localuser'
interface UserGenListProps {
    userId: string
    handleShare: (url: string) => void
}

const UserGenList: React.FC<UserGenListProps> = (props: UserGenListProps) => {
    const [nextPage, setNextPage] = useState<string | undefined>(undefined)
    const [items, setItems] = useState<GenerationRequest[]>([])
    const [isFetchinData, setIsFetchinData] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const gContext = useGenerationContext()

    const fetchData = async (pageKey?: string) => {
        setErrorMessage(undefined)
        setIsFetchinData(true)

        try {
            if (props.userId === LOCAL_USERID) {
                const itemsPerPage = 12
                const startPos = nextPage === undefined ? 0 : parseInt(nextPage)
                const outputs = gContext.i2vOutputs.slice(startPos, itemsPerPage)
                const data = outputs.map((output: GenerationOutputItem): GenerationRequest => {
                    return {
                        id: 'local',
                        type: GenerationType.IMG2VID,
                        input: {
                            modelId: 'unknown',
                            motionBucketId: DEFAULT_MOTION_BUCKET_ID,
                            noiseAugStrength: DEFAULT_NOISE_AUG_STRENGTH,
                            width: DEFAULT_VIDEO_WIDTH,
                            height: DEFAULT_VIDEO_HEIGHT,
                        } as Img2vidInput,
                        outputs: [output]
                    }
                })
                setItems(data)
                setNextPage((startPos + itemsPerPage).toString())
            }
            else {
                const data = await fetchAssetsByUser(props.userId, pageKey)
                setNextPage(data.nextPage)
                setItems(items.concat(data.items))
            }
        }
        catch (e: any) {
            setErrorMessage(`Fetch gallery data failed ${e.message}`)
        }
        finally {
            setIsFetchinData(false)
        }
    }
    return (
        <ImageGrid
            isFetchinData={isFetchinData}
            items={items}
            errorMessage={errorMessage}
            nextPage={nextPage}
            fetchData={fetchData}
            handleShare={props.handleShare} />
    )
}
export default UserGenList