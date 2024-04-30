'use client'
import { fetchGallery } from "@/actions/stable-diffusion"
import { GenerationRequest } from "@/libs/types"
import { Spacer, Spinner, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"
import styles from "@/styles/home.module.css"
import ErrorComponent from "@/components/error"
import CellModal from "./cell-modal"
import { PrimaryButton } from "@/components/buttons"
import ImageGrid from "../../components/image-grid"

interface CommunityListProps {
    handleShare: (url: string) => void
}
const CommunityList: React.FC<CommunityListProps> = (props: CommunityListProps) => {
    const [nextPage, setNextPage] = useState<string | undefined>(undefined)
    const [items, setItems] = useState<GenerationRequest[]>([])
    const [isFetchinData, setIsFetchinData] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [selectedCell, setSelectedCell] = useState<string>('')

    const fetchData = async (pageKey?: string) => {
        setErrorMessage(undefined)
        setIsFetchinData(true)

        try {

            const data = await fetchGallery(pageKey)
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
            {selectedCell && <CellModal imgUrl={selectedCell} isOpen={isOpen} onClose={handleCloseModal} handleShare={handleShare} />}
            {isFetchinData && <div className={styles.center}><Spacer y={4} /><Spinner color="warning" /></div>}
            <ImageGrid items={items} onClickItem={handleOpenModal} />
            {errorMessage && <ErrorComponent errorMessage={errorMessage} />}
            <div className={styles.center}>
                <Spacer y={4} />
                {nextPage && <PrimaryButton onPress={() => fetchData(nextPage)} className='font-medium'>Load More</PrimaryButton>}
            </div>
        </>
    )
}
export default CommunityList