'use client'
import { fetchGallery } from "@/actions/stable-diffusion"
import { GenerationRequest } from "@/libs/types"
import { Spacer, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@nextui-org/react"
import { useEffect, useState } from "react"
import GalleryCell from "./cell"
import styles from "@/styles/home.module.css"
import ErrorComponent from "@/components/error"

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

    useEffect(() => {
        fetchData(undefined)
    }, [])

    return (
        <>

            {isFetchinData && <div className={styles.center}><Spacer y={4}></Spacer><Spinner color="warning" /></div>}
            <Table radius="sm" hideHeader className={styles.galleryTable} aria-label="Gallery">
                <TableHeader>
                    <TableColumn>url</TableColumn>
                </TableHeader>
                <TableBody>
                    {items.map((item, index) => (

                        < TableRow key={index} >
                            <TableCell key={item.id}>
                                <GalleryCell
                                    src={item.outputs?.[0].url!}
                                    handleClickShare={props.handleShare} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {errorMessage && <ErrorComponent errorMessage={errorMessage} />}
            <div className={styles.center}>
                {nextPage && <Button onPress={() => fetchData(nextPage)} className="bg-[#ff8d82]">Load More</Button>}
            </div>
        </>
    )
}
export default CommunityList