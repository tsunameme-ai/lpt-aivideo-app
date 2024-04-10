'use client'

import { Installer } from '@/components/installer';
import { NextUIProvider } from '@nextui-org/react'
import React from 'react';
import { useState } from 'react';


export function Providers({ children }: { children: React.ReactNode }) {
    const [isAppReady, setIsAppReady] = useState<boolean>(false)

    return (
        <NextUIProvider>
            <Installer onAppReadyChange={setIsAppReady} />
            {
                isAppReady &&
                <React.Fragment>{children}</React.Fragment>
            }
        </NextUIProvider>
    );
}