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
import { useRouter } from "next/navigation"
import { useGenerationContext } from "@/context/generation-context"
import styles from "@/styles/home.module.css"

export default function Page() {
    const { authenticated, user, ready } = usePrivy()
    const [userId, setUserId] = useState<string | undefined>(undefined)
    const gContext = useGenerationContext()
    const router = useRouter()

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
            <div className="flex w-11/12 h-[calc(100vh-66px)] m-auto" style={{ overflow: 'scroll' }}>
                {ready && <div className={`${appFont.className} ${styles.centerGallery}`}>
                    {
                        !userId ? <>
                            <div className='font-medium text-center'>What The Community Is Creating</div>
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
                </div>}
                <div className="right absolute bottom-0 right-0 m-2 z-20 w-20 h-20">
                    <Button onPress={() => {
                        gContext.reset()
                        router.push('/txt2img')
                    }} className="w-full h-full" variant="shadow" color="primary" size='lg' radius="full" isIconOnly={true}>
                        <IoMdCreate size={48} />
                    </Button>
                </div>
            </div>
        </>
    )
}