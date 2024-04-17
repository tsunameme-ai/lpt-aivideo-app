import { Image, Modal, ModalContent, ModalHeader, ModalFooter } from "@nextui-org/react"
import { FaShare } from "react-icons/fa"
import styles from "@/styles/home.module.css"

interface CellModalProps {
    imgUrl: string,
    isOpen: boolean,
    onClose?: () => void
    handleShare?: (url: string) => void
}

const CellModal: React.FC<CellModalProps> = (props: CellModalProps) => {

    return (
        <>
            <Modal isOpen={props.isOpen} onClose={() => { props.onClose?.() }} placement="center" backdrop="blur" >
                <ModalHeader />
                <ModalContent>
                    <Image src={props.imgUrl} alt={props.imgUrl} />
                    <FaShare className={styles.galleryShareIcon} onClick={() => props.handleShare?.(props.imgUrl)} />
                </ModalContent>
                <ModalFooter />
            </Modal>
        </>
    )
}

export default CellModal
