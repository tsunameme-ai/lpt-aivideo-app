'use client'
import { Tabs, Tab, Spacer, Button } from "@nextui-org/react"
import 'react-toastify/dist/ReactToastify.css'
import { usePrivy } from "@privy-io/react-auth"
import CommunityList from "./community-gens"
import UserGenList from "./user-gens"
import { ToastContainer } from 'react-toastify'
import { appFont } from "../fonts"
import { share } from "@/libs/share-utils"
import { useEffect, useState } from "react"
import { IoMdCreate } from "react-icons/io";

export default function Page() {
    const { authenticated, user } = usePrivy()
    const [userId, setUserId] = useState<string | undefined>(undefined)

    const toastId = "gallery-copy-success"
    const handleShare = (itemurl: string) => {
        share({
            url: itemurl,
            toastTitle: 'GIF link is copied. Send it!'
        }, toastId)
    }
    useEffect(() => {
        if (authenticated && user) {
            setUserId(user.id)
        }
        else {
            setUserId(undefined)
        }
    }, [authenticated, user])


    return (
        <>
            <ToastContainer />
            <div className="flex w-full h-[calc(100vh-66px)]" style={{ overflow: 'scroll' }}>
                <div className={`${appFont.className} w-full`}>
                    {
                        !userId ? <>
                            <div className='font-medium text-center'>What the community is creating</div>
                            <Spacer y={2} />
                            <CommunityList handleShare={handleShare} />
                        </> : <>
                            <Tabs fullWidth classNames={{
                                tabContent: "group-data-[selected=true]:text-[#f1faee]",
                                cursor: "w-full bg-[#ffc303]",
                                tab: "text-[20px]"
                            }} >
                                <Tab key='community' title='Community'><CommunityList handleShare={handleShare} /></Tab>
                                <Tab key='me' title='Me'><UserGenList userId={userId} handleShare={handleShare} /></Tab>
                            </Tabs>
                        </>
                    }
                </div>
                <div className="right absolute bottom-0 right-0 m-4 z-20 w-24 h-24">

                    <Button className="w-full h-full" variant="shadow" color="primary" size='lg' radius="full" isIconOnly={true}>
                        <IoMdCreate size={60} />
                    </Button>
                </div>
            </div>
        </>
    )
}