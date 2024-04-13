import { fetchAssetsByUser } from "@/actions/stable-diffusion"
import { GenerationRequest } from "@/libs/types"
import { Spacer, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@nextui-org/react"
import { useEffect, useState } from "react"
import GalleryCell from "./cell"
import styles from "@/styles/home.module.css"
import ErrorComponent from "@/components/error"
import { useRouter } from 'next/navigation'
import { useGenerationContext } from '@/context/generation-context'

interface UserGenListProps {
    userId: string
    handleShare: (url: string) => void
}
const UserGenList: React.FC<UserGenListProps> = (props: UserGenListProps) => {
    const [nextPage, setNextPage] = useState<string | undefined>(undefined)
    const [items, setItems] = useState<GenerationRequest[]>([])
    const [isFetchinData, setIsFetchinData] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const router = useRouter()
    const gContext = useGenerationContext()

    const fetchData = async (pageKey?: string) => {
        setErrorMessage(undefined)
        setIsFetchinData(true)

        try {
            const data = await fetchAssetsByUser(props.userId, pageKey)
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

    const handleTxt2img = () => {
        //Clear context 
        gContext.reset()

        router.push('/txt2img')
    }

    return (
        <>
            {isFetchinData && <div className={styles.center}><Spacer y={4} /><Spinner color="warning" /></div>}
            {
                items.length > 0 ?
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
                    : <>
                        {!isFetchinData && <div className={styles.center}>
                            <Spacer y={2} />
                            <Button size='lg' className='w-full' color='primary' variant="ghost" radius='sm' onPress={handleTxt2img}>Get Started</Button>
                        </div>}
                    </>
            }
            {errorMessage && <ErrorComponent errorMessage={errorMessage} />}
            <div className={styles.center}>
                {nextPage && <Button onPress={() => fetchData(nextPage)} color='primary' radius='sm' >Load More</Button>}
            </div>
        </>
    )
}
export default UserGenList