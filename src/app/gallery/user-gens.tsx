import { fetchAssetsByUser } from "@/actions/stable-diffusion"
import { DEFAULT_MOTION_BUCKET_ID, DEFAULT_NOISE_AUG_STRENGTH, DEFAULT_VIDEO_HEIGHT, DEFAULT_VIDEO_WIDTH, GenerationOutputItem, GenerationRequest, GenerationType, Img2vidInput } from "@/libs/types"
import { Spacer, Spinner, Image, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"
import styles from "@/styles/home.module.css"
import ErrorComponent from "@/components/error"
import { useRouter } from 'next/navigation'
import { useGenerationContext } from '@/context/generation-context'
import CellModal from "./cell-modal"
import { PrimaryButton, SecondaryButton } from "@/components/buttons"
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
    const router = useRouter()
    const gContext = useGenerationContext()
    const [selectedCell, setSelectedCell] = useState<string>('')

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

    const { onOpen, isOpen, onClose } = useDisclosure()
    const handleOpenModal = (url: string) => {
        setSelectedCell(url)
        onOpen()
    }

    const handleCloseModal = () => {
        onClose()
    }

    const handleShare = (itemurl: string) => {
        props.handleShare(itemurl)
    }

    useEffect(() => {
        fetchData(undefined)
    }, [])

    const handleTxt2img = () => {

        gContext.reset()
        router.push('/txt2img')
    }

    return (
        <>
            <CellModal imgUrl={selectedCell} isOpen={isOpen} onClose={handleCloseModal} handleShare={handleShare} />
            {isFetchinData && <div className={styles.center}><Spacer y={4} /><Spinner color="warning" /></div>}
            {
                items.length > 0 ?
                    <ImageGrid items={items} onClickItem={handleOpenModal} />
                    : <>
                        {!isFetchinData && <div className={styles.center}>
                            <Spacer y={1} />
                            <SecondaryButton onPress={handleTxt2img}>Get Started</SecondaryButton>
                        </div>}
                    </>
            }
            {errorMessage && <ErrorComponent errorMessage={errorMessage} />}
            <div className={styles.center}>
                <Spacer y={4} />
                {nextPage && <PrimaryButton onPress={() => fetchData(nextPage)} className='font-medium'>Load More</PrimaryButton>}
            </div >
        </>
    )
}
export default UserGenList