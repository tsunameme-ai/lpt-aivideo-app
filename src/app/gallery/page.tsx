'use client'
import { fetchGallery } from "@/actions/stable-diffusion"
import ErrorComponent from "@/components/error"
import { GenerationRequest } from "@/libs/types"
import styles from "@/styles/home.module.css"
import { Button, Spacer, Spinner, Tabs, Tab, Card, CardBody } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell } from "@nextui-org/react"
import { FaShare } from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MediaPlayerComponent from "@/components/media-player"

export default function Page() {
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

    const toastId = "gallery-copy-success"
    const handleShare = (itemurl: string) => {

        navigator.clipboard.writeText(`${itemurl}`)
        toast.success("GIF link is copied. Send it!", {
            toastId: toastId,
            autoClose: 1200,
            hideProgressBar: true
        })
    }

    useEffect(() => {
        fetchData(undefined)
    }, [])

    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    <ToastContainer />
                    <Card className="max-w-full">
                        <CardBody className="overflow-hidden">
                            <Tabs fullWidth classNames={{
                                tabContent: "group-data-[selected=true]:text-[#f1faee]",
                                cursor: "w-full bg-[#ffc303]"
                            }} >
                                <Tab key='community' title='Community' >
                                    {isFetchinData && <div className={styles.center}><Spacer y={4}></Spacer><Spinner color="warning" /></div>}
                                    <Table radius="sm" hideHeader className={styles.galleryTable} aria-label="Gallery">
                                        <TableHeader>
                                            <TableColumn>url</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {items.map((item, index) => (

                                                < TableRow key={index} >
                                                    <TableCell key={item.id}>
                                                        <MediaPlayerComponent className={styles.videoPreview} src={item.outputs?.[0].url!} />
                                                        <FaShare className={styles.galleryShareIcon} onClick={() => handleShare(item.outputs?.[0].url!)} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className={styles.center}>
                                        {nextPage && <Button onPress={() => fetchData(nextPage)} className="bg-[#ff8d82]">Load More</Button>}
                                    </div>
                                </Tab>
                                <Tab key='me' title='Me'>
                                    Nothing yet!
                                </Tab>
                            </Tabs>
                        </CardBody>
                    </Card>

                    {errorMessage && <ErrorComponent errorMessage={errorMessage} />}
                </div>
            </section>
        </>
    )
}