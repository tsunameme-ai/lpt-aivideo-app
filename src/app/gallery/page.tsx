'use client'
import { Tabs, Tab, Spacer } from "@nextui-org/react"
import 'react-toastify/dist/ReactToastify.css'
import { usePrivy } from "@privy-io/react-auth"
import CommunityList from "./community-gens"
import UserGenList, { LOCAL_USERID } from "./user-gens"
import { ToastContainer } from 'react-toastify'
import { appFont } from "../fonts"
import { share } from "@/libs/share-utils"
import { useGenerationContext } from "@/context/generation-context"
import { useEffect, useState } from "react"

export default function Page() {
    const { authenticated, user } = usePrivy()
    const gContext = useGenerationContext()
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
        else if (gContext.i2vOutputs.length > 0 && process.env.NEXT_PUBLIC_USERGEN === 'local') {
            setUserId(LOCAL_USERID)
        }
        else {
            setUserId(undefined)
        }
    }, [gContext.i2vOutputs, authenticated])


    return (
        <>
            <ToastContainer />
            <section className={`flex flex-col items-center justify-center ${appFont.className}`}>
                <div className="w-full">
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
            </section>
        </>
    )
}