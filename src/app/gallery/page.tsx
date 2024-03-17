'use client'
import { fetchGallery } from "@/actions/stable-diffusion"
import ErrorComponent from "@/components/error"
import { GenerationRequest } from "@/libs/types"
import styles from "@/styles/home.module.css"
import { Button, Spacer, Spinner } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell } from "@nextui-org/react"
import { Tabs, Tab } from "@nextui-org/react"

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
            setItems(data.items)
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
            <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    <div className="flex justify-center items-center">What other people are creating </div>
                    <Spacer y={5}></Spacer>
                    <div>
                        <Tabs className="w-full">
                            <Tab key='community' title='Community'>
                                {isFetchinData && <Spinner />}
                                <Table hideHeader>
                                    <TableHeader>
                                        <TableColumn>url</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell><video className={styles.videoPreview} controls autoPlay src={item.outputs?.[0].url} /></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>

                                </Table>
                                {nextPage && <Button onPress={() => fetchData(nextPage)}>Next Page</Button>}
                            </Tab>
                            <Tab key='me' title='Me'>
                                Under construction
                            </Tab>
                        </Tabs>


                    </div>
                    {errorMessage && <ErrorComponent errorMessage={errorMessage} />}
                </div>
            </section>
        </>
    )
}