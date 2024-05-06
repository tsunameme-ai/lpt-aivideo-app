import { Modal, ModalContent, ModalFooter } from "@nextui-org/react"
import { FaShare } from "react-icons/fa"
import styles from "@/styles/home.module.css"
import MediaPlayerComponent from "@/components/media-player"
import { GenerationRequest } from "@/libs/types"
import { useState } from "react"
import { togglePublish } from "@/actions/stable-diffusion"
import { getAccessToken } from "@privy-io/react-auth"
import { SecondaryButton } from "../buttons"

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
        props.asset.outputs?.[0].visibility === 'community'
        setIsUpdatingVisibility(true)
        try {
            const accessToken = await getAccessToken()
            if (!accessToken) {
                throw new Error(`Invalid accessToken`)
            }
            const data = await togglePublish(props.loggedInUserId!, props.asset.id, accessToken, props.asset.outputs?.[0].visibility !== 'community')
            console.log(`???? ${data.success}`)
            if (data.success && (props.asset.outputs || []).length > 0) {
                props.asset.outputs![0].visibility = data.visibility
                console.log(`??? ${props.asset.outputs![0].visibility} `)
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
                    {props.loggedInUserId && <ModalFooter>
                        <SecondaryButton isLoading={isUpdatingVisibility} onPress={updatePublish}>{props.asset.outputs?.[0].visibility === 'community' ? 'Remove from Community' : 'Share with Community'}</SecondaryButton>
                    </ModalFooter>}
                </ModalContent>
            </Modal>
        </>
    )
}

export default CellModal
