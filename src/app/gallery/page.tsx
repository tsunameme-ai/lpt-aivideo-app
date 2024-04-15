'use client'
import { Tabs, Card, CardBody, Tab } from "@nextui-org/react"
import 'react-toastify/dist/ReactToastify.css'
import { usePrivy } from "@privy-io/react-auth"
import CommunityList from "./community-gens"
import UserGenList from "./user-gens"
import { ToastContainer } from 'react-toastify'
import { appFont } from "../fonts"
import { share } from "@/libs/share-utils"

export default function Page() {
    const { authenticated, user } = usePrivy()

    const toastId = "gallery-copy-success"
    const handleShare = (itemurl: string) => {
        share({
            url: itemurl,
            toastTitle: 'GIF link is copied. Send it!'
        }, toastId)
    }


    return (
        <>
            <ToastContainer />
            <section className={`flex flex-col items-center justify-center ${appFont.className}`}>
                <div className="w-full">
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