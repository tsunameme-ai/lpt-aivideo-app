'use client'

import CompetitionBanner from '@/components/competition-promo';
import { Installer } from '@/components/installer'
import GenerationContextProvider from '@/context/generation-context';
import { NextUIProvider } from '@nextui-org/react'
import { PrivyProvider } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useState } from 'react';


export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isAppReady, setIsAppReady] = useState<boolean>(false)
    const [promptCompetition, setPromptCompetition] = useState<boolean>(false)
    const dismissCompetitionPromptTimeKey = 'dismiss-competition-prompt'
    const competitionPromptSilentDuration = 86400 / 2 //12hours
    const closePromptCompetition = () => {
        setPromptCompetition(false)
        localStorage.setItem(dismissCompetitionPromptTimeKey, Math.floor(new Date().getTime() / 1000).toString())

    }
    useEffect(() => {
        if (isAppReady) {
            let shouldShowCompetitionPrompt = true
            try {
                const lastTimeLS = localStorage.getItem(dismissCompetitionPromptTimeKey)
                if (lastTimeLS !== null) {
                    const time = parseInt(lastTimeLS)
                    if (new Date().getTime() / 1000 - time < competitionPromptSilentDuration) {
                        shouldShowCompetitionPrompt = false
                    }
                }
            }
            catch (e) {

            }
            if (shouldShowCompetitionPrompt) {
                setPromptCompetition(true)
            }
        }

    }, [isAppReady])
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_ID!}>
            <NextUIProvider>
                <GenerationContextProvider>
                    <Installer onAppReadyChange={setIsAppReady} />
                    {
                        isAppReady &&
                        <>
                            <>{children}</>
                            <>{
                                promptCompetition && <CompetitionBanner
                                    onCheckoutDetails={() => {
                                        closePromptCompetition()
                                        router.push('/competition')

                                    }}
                                    onClose={() => {
                                        closePromptCompetition()
                                    }} />
                            }
                            </>
                        </>
                    }
                </GenerationContextProvider>
            </NextUIProvider>
        </PrivyProvider>
    );
}