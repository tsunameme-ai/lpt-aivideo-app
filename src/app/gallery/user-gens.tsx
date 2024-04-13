import { fetchAssetsByUser } from "@/actions/stable-diffusion"
import { GenerationRequest } from "@/libs/types"
import { Spacer, Spinner, Image, Button, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"
import styles from "@/styles/home.module.css"
import ErrorComponent from "@/components/error"
import { useRouter } from 'next/navigation'
import { useGenerationContext } from '@/context/generation-context'
import CellModal from "./cellModal"

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
            const data = await fetchAssetsByUser(props.userId, pageKey)
            setNextPage(data.nextPage)
            setItems(items.concat(data.items))
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
                    <div className="grid grid-cols-3 gap-1">
                        {items.map((item, index) => (
                            <div key={index}>
                                <Image radius="sm" src={item.outputs?.[0].url!} alt={index.toString()} onClick={() => { handleOpenModal(item.outputs?.[0].url!) }} />
                            </div>
                        ))}
                    </div>
                    : <>
                        {!isFetchinData && <div className={styles.center}>
                            <Spacer y={1} />
                            <Button size='sm' className={styles.startBtn} onPress={handleTxt2img}>
                                <div className='text-[20px]'>Get Started</div>
                            </Button>
                        </div>}
                    </>
            }
            {errorMessage && <ErrorComponent errorMessage={errorMessage} />}
            <div className={styles.center}>
                <Spacer y={1} />
                {nextPage && <Button onPress={() => fetchData(nextPage)} className="bg-[#ff8d82]">Load More</Button>}
            </div>
        </>
    )
}
export default UserGenList