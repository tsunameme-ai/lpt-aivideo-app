'use client'
import { fetchGallery } from "@/actions"
import { GenerationRequest } from "@/libs/types"
import { useState } from "react"
import ImageGrid from "../../components/image-grid"

interface CommunityListProps {
    handleShare: (url: string) => void
}

const CommunityList: React.FC<CommunityListProps> = (props: CommunityListProps) => {
    const [nextPage, setNextPage] = useState<string | undefined>(undefined)
    const [items, setItems] = useState<GenerationRequest[]>([])
    const [isFetchinData, setIsFetchinData] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const fetchData = async (pageKey?: string) => {
        setErrorMessage(undefined)
        setIsFetchinData(true)

        try {
            const data = await fetchGallery(10, pageKey)
            if (!nextPage || data.nextPage !== nextPage) {
                setNextPage(data.nextPage)
                setItems(items.concat(data.items))
            }
        }
        catch (e: any) {
            setErrorMessage(`Fetch gallery data failed ${e?.message}`)
        }
        finally {
            setIsFetchinData(false)
        }
    }

    return (
        <ImageGrid
            isFetchinData={isFetchinData}
            items={items}
            errorMessage={errorMessage}
            nextPage={nextPage}
            fetchData={fetchData}
            handleShare={props.handleShare} />
    )
}
export default CommunityList