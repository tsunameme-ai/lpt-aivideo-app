'use client'

import { Installer } from '@/components/installer'
import { NextUIProvider } from '@nextui-org/react'
import { PrivyProvider } from '@privy-io/react-auth';
import React from 'react';
import { useState } from 'react';


export function Providers({ children }: { children: React.ReactNode }) {
    const [isAppReady, setIsAppReady] = useState<boolean>(false)
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_ID!}>
            <NextUIProvider>
                <Installer onAppReadyChange={setIsAppReady} />
                {
                    isAppReady &&
                    <React.Fragment>{children}</React.Fragment>
                }
            </NextUIProvider>
        </PrivyProvider>
    );
}