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
    useEffect(() => {
        if (isAppReady) {
            setPromptCompetition(true)
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
                                        setPromptCompetition(false)
                                        router.push('/competition')

                                    }}
                                    onClose={() => {
                                        setPromptCompetition(false)
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