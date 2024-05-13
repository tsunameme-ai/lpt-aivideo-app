import { Modal, ModalContent, ModalFooter } from "@nextui-org/react"
import { FaShare } from "react-icons/fa"
import styles from "@/styles/home.module.css"
import MediaPlayerComponent from "@/components/media-player"
import { GenerationRequest } from "@/libs/types"
import { togglePublish } from "@/actions"
import { getAccessToken } from "@privy-io/react-auth"
import { SecondaryButton } from "../buttons"
import { useState } from "react"

interface CellModalProps {
    loggedInUserId?: string
    asset: GenerationRequest
    isOpen: boolean,
    onClose?: () => void
    handleShare?: (url: string) => void
}

const CellModal: React.FC<CellModalProps> = (props: CellModalProps) => {
    const [isUpdatingVisibility, setIsUpdatingVisibility] = useState<boolean>(false)
    const updatePublish = async () => {
        setIsUpdatingVisibility(true)
        try {
            const accessToken = await getAccessToken()
            if (!accessToken) {
                throw new Error(`Invalid accessToken`)
            }
            const data = await togglePublish(props.loggedInUserId!, props.asset.id, accessToken, props.asset.visibility !== 'community')
            if (data.success) {
                props.asset.visibility = data.visibility
            }
        }
        catch (e) {
            console.error(e)
        }
        finally {
            setIsUpdatingVisibility(false)
        }
    }

    return (
        <>
            <Modal radius="sm" className={styles.galleryModal} hideCloseButton={true} isOpen={props.isOpen} onClose={() => { props.onClose?.() }} placement="center" backdrop="blur" >
                <ModalContent className="flex items-center">
                    <MediaPlayerComponent src={props.asset.outputs?.[0].url!} key={props.asset.outputs?.[0].url!} className={"w-full"} />
                    <FaShare className={styles.galleryShareIcon} onClick={() => props.handleShare?.(props.asset.outputs?.[0].url!)} />
                    {props.loggedInUserId && ((props.asset.outputs?.[0].nsfw || false) === false) && <ModalFooter>
                        <SecondaryButton isLoading={isUpdatingVisibility} onPress={updatePublish}>{props.asset.visibility === 'community' ? 'Remove from Community' : 'Share with Community'}</SecondaryButton>
                    </ModalFooter>}
                </ModalContent>
            </Modal>
        </>
    )
}

export default CellModal
