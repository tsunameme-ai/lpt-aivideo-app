'use client'
import { fetchGallery } from "@/actions/stable-diffusion"
import ErrorComponent from "@/components/error"
import { GenerationRequest } from "@/libs/types"
import styles from "@/styles/home.module.css"
import { Button, Spacer, Spinner } from "@nextui-org/react"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"

export default function Page() {
    const router = useRouter()
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
                    <div className="flex justify-center items-center">GALLERY page is still under contruction </div>
                    <Spacer y={5}></Spacer>
                    <div className="flex justify-center items-center"><Button color="primary" onClick={() => router.back()}>Back</Button></div>
                    <div>
                        <h2>--data start--</h2>
                        {isFetchinData && <Spinner />}
                        <table>
                            <tbody>
                                <tr>
                                    <th>row</th>
                                    <th>id</th>
                                    <th>url</th>
                                </tr>
                                {items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index}</td>
                                        <td>{item.id}</td>
                                        <td>{item.outputs?.[0].url}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                        {nextPage && <Button onPress={() => fetchData(nextPage)}>Next Page</Button>}
                        <h2>--data end--</h2>
                    </div>
                    {errorMessage && <ErrorComponent errorMessage={errorMessage} />}
                </div>
            </section>
        </>
    )
}