import { fetchAssetsByUser } from "@/actions"
import { useState } from "react"
import ImageGrid from "../../components/image-grid"
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

    const fetchData = async (pageKey?: string) => {
        setErrorMessage(undefined)
        setIsFetchinData(true)

        try {
            const data = await fetchAssetsByUser(props.userId, 10, pageKey)
            if (!nextPage || data.nextPage !== nextPage) {
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
    return (
        <ImageGrid
            loggedInUserId={props.userId}
            isFetchinData={isFetchinData}
            items={items}
            errorMessage={errorMessage}
            nextPage={nextPage}
            fetchData={fetchData}
            handleShare={props.handleShare} />
    )
}
export default UserGenList