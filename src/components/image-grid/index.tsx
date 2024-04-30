'use client'
import { GenerationRequest } from "@/libs/types"
import { Spacer, Spinner, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"
import styles from "@/styles/home.module.css"
import ErrorComponent from "@/components/error"
import CellModal from "./cell-modal"
import { PrimaryButton } from "@/components/buttons"
import Grid from "./grid"

interface ImageGridProps {
    isFetchinData: boolean
    items: GenerationRequest[]
    errorMessage?: string
    nextPage?: string
    handleShare: (url: string) => void
    fetchData: (pageKey?: string) => void
}
const ImageGrid: React.FC<ImageGridProps> = (props: ImageGridProps) => {
    const [selectedCell, setSelectedCell] = useState<string>('')

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
        props.fetchData(undefined)
    }, [])

    return (
        <>
            {selectedCell && <CellModal imgUrl={selectedCell} isOpen={isOpen} onClose={handleCloseModal} handleShare={handleShare} />}
            {props.isFetchinData && <div className={styles.center}><Spacer y={4} /><Spinner color="warning" /></div>}
            <Grid items={props.items} onClickItem={handleOpenModal} />
            {props.errorMessage && <ErrorComponent errorMessage={props.errorMessage} />}
            <div className={styles.center}>
                <Spacer y={4} />
                {props.nextPage && <PrimaryButton onPress={() => props.fetchData(props.nextPage)} className='font-medium'>Load More</PrimaryButton>}
            </div>
        </>
    )
}
export default ImageGrid