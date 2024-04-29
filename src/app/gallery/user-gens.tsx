import { fetchAssetsByUser } from "@/actions/stable-diffusion"
import { Spacer, Spinner, Image, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"
import styles from "@/styles/home.module.css"
import ErrorComponent from "@/components/error"
import CellModal from "./cell-modal"
import { SecondaryButton } from "@/components/buttons"
import { GenerationRequest } from "@/libs/types"

interface UserGenListProps {
    userId: string
    handleShare: (url: string) => void
}

const UserGenList: React.FC<UserGenListProps> = (props: UserGenListProps) => {
    const [nextPage, setNextPage] = useState<string | undefined>(undefined)
    const [items, setItems] = useState<GenerationRequest[]>([])
    const [isFetchinData, setIsFetchinData] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [selectedCell, setSelectedCell] = useState<string>('')

    const fetchData = async (pageKey?: string) => {
        setErrorMessage(undefined)
        setIsFetchinData(true)

        try {
            const data = await fetchAssetsByUser(props.userId, 10, pageKey)
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

    return (
        <>
            <CellModal imgUrl={selectedCell} isOpen={isOpen} onClose={handleCloseModal} handleShare={handleShare} />
            {isFetchinData && <div className={styles.center}><Spacer y={4} /><Spinner color="warning" /></div>}
            {
                items.length > 0 &&
                <div className="grid grid-cols-2 gap-1">
                    {items.map((item, index) => (
                        <div key={index}>
                            <Image radius="sm" src={item.outputs?.[0].url!} alt={index.toString()} onClick={() => { handleOpenModal(item.outputs?.[0].url!) }} />
                        </div>
                    ))}
                </div>
            }
            {errorMessage && <ErrorComponent errorMessage={errorMessage} />}
            <div className={styles.center}>
                <Spacer y={4} />
                {nextPage && <SecondaryButton onPress={() => fetchData(nextPage)} className='font-medium'>Load More</SecondaryButton>}
                <Spacer y={4} />
            </div >
        </>
    )
}
export default UserGenList