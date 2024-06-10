'use client'
import 'react-toastify/dist/ReactToastify.css'
import styles from '@/styles/home.module.css'
import { usePrivy } from "@privy-io/react-auth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGenerationContext } from "@/context/generation-context"
import { PrimaryButton } from "@/components/buttons"
import { appFont } from '../fonts'
import { Link } from "@nextui-org/react"

export default function Page() {
    const { authenticated, user, ready, login } = usePrivy()
    const [userId, setUserId] = useState<string | undefined>(undefined)
    const gContext = useGenerationContext()
    const router = useRouter()

    useEffect(() => {
        if (authenticated && user) {
            setUserId(user.id)
        }
        else {
            setUserId(undefined)
        }
    }, [authenticated, user])


    return (
        <section className={`${styles.main} ${appFont.className}`}>
            {
                ready &&
                <div className={styles.centerSection}>
                    <div>
                        <p>
                            Between June 10th and 16th, we invite you to join a GIF creation competition. Those who can come up with the most interesting gif expressions with the Tsunameme app
                            will be rewarded handsomely. So bring your A game.
                        </p>
                        <br />
                        <p>
                            <strong>Awards:</strong>
                            <ul>
                                <li>- The most creative gif expression: 75 LPT</li>
                                <li>- The most visually stunning gif expression: 50 LPT </li>
                                <li>- The most epic fail gif expression: 25 LPT </li>
                            </ul>
                        </p>
                        <br />
                        <p>
                            <strong>Rules:</strong>
                            <ul>
                                <li>1. You need to have a Tsunameme account before creating the gif expression. (That is how we know it is your creation)</li>
                                <li>2. You can only submit up to 3 entries.</li>
                                <li>3. Using captions in the GIF is highly encouraged although not absolutely required.</li>
                            </ul>
                        </p>
                        <br />
                        <p>
                            <strong>Submission:</strong>
                            <br />
                            You can post the creation from your X(Twitter) account publicly and mention <Link className="text-[#f97216]" href="https://www.x.com/tsunameme_ai">@tsunameme_ai</Link> in the post or directly DM <Link className="text-[#f97216]" href="https://www.x.com/tsunameme_ai">@tsunameme_ai</Link> the link of your creation.
                        </p>
                        <br />

                    </div>
                    {
                        userId ? <>
                            <PrimaryButton onPress={() => {
                                gContext.reset()
                                router.push('/txt2img')
                            }}>Create</PrimaryButton>

                        </>
                            :
                            <PrimaryButton onPress={login}>Login</PrimaryButton>
                    }
                </div >
            }
        </section>
    )
}