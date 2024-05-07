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
    loggedInUserId?: string
    isFetchinData: boolean
    items: GenerationRequest[]
    errorMessage?: string
    nextPage?: string
    handleShare: (url: string) => void
    fetchData: (pageKey?: string) => void
}
const ImageGrid: React.FC<ImageGridProps> = (props: ImageGridProps) => {
    const [selectedAsset, setSelectedAsset] = useState<GenerationRequest>()

    const { onOpen, isOpen, onClose } = useDisclosure()
    const handleOpenModal = (item: GenerationRequest) => {
        setSelectedAsset(item)
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
            {selectedAsset && <CellModal
                loggedInUserId={props.loggedInUserId}
                asset={selectedAsset}
                isOpen={isOpen}
                onClose={handleCloseModal}
                handleShare={handleShare} />}
            {props.isFetchinData && <div className={styles.center}><Spacer y={4} /><Spinner color="warning" /></div>}
            <Grid items={props.items} onClickItem={handleOpenModal} />
            {props.errorMessage && <ErrorComponent errorMessage={props.errorMessage} />}
            <div className={styles.center}>
                <Spacer y={4} />
                {props.nextPage && <PrimaryButton isDisabled={props.isFetchinData} onPress={() => props.fetchData(props.nextPage)} className='font-medium'>Load More</PrimaryButton>}
                <Spacer y={4} />
            </div>
        </>
    )
}
export default ImageGrid