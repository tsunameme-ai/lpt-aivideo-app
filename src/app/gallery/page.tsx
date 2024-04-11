'use client'
import styles from "@/styles/home.module.css"
import { Tabs, Card, CardBody, Tab } from "@nextui-org/react"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { usePrivy } from "@privy-io/react-auth"
import CommunityList from "./community-gens"
import UserGenList from "./user-gens"

export default function Page() {
    const { authenticated, user } = usePrivy()

    const toastId = "gallery-copy-success"
    const handleShare = (itemurl: string) => {

        navigator.clipboard.writeText(`${itemurl}`)
        toast.success("GIF link is copied. Send it!", {
            toastId: toastId,
            autoClose: 1200,
            hideProgressBar: true
        })
    }


    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    <ToastContainer />
                    <Card className="max-w-full">
                        <CardBody className="overflow-hidden">
                            <Tabs fullWidth classNames={{
                                tabContent: "group-data-[selected=true]:text-[#f1faee]",
                                cursor: "w-full bg-[#ffc303]",
                                tab: "text-[20px]"
                            }} >
                                <Tab key='community' title='Community'><CommunityList handleShare={handleShare} /></Tab>
                                {authenticated && user && <Tab key='me' title='Me'><UserGenList userId={user.id} handleShare={handleShare} /></Tab>}
                            </Tabs>
                        </CardBody>
                    </Card>
                </div>
            </section>
        </>
    )
}