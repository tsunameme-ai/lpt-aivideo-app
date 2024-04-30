import { Modal, ModalContent } from "@nextui-org/react"
import { FaShare } from "react-icons/fa"
import styles from "@/styles/home.module.css"
import MediaPlayerComponent from "@/components/media-player"

interface CellModalProps {
    imgUrl: string,
    isOpen: boolean,
    onClose?: () => void
    handleShare?: (url: string) => void
}

const CellModal: React.FC<CellModalProps> = (props: CellModalProps) => {

    return (
        <>
            <Modal radius="sm" className={styles.galleryModal} hideCloseButton={true} isOpen={props.isOpen} onClose={() => { props.onClose?.() }} placement="center" backdrop="blur" >
                <ModalContent className="flex items-center">
                    <MediaPlayerComponent src={props.imgUrl} key={props.imgUrl} className={"w-full"} />
                    <FaShare className={styles.galleryShareIcon} onClick={() => props.handleShare?.(props.imgUrl)} />
                </ModalContent>
            </Modal>
        </>
    )
}

export default CellModal
