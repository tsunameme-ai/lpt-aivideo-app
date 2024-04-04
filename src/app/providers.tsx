// app/providers.tsx
'use client'

import { DisplayMode, Installer } from '@/components/installer';
import { NextUIProvider } from '@nextui-org/react'
import React from 'react';
import { useState } from 'react';


export function Providers({ children }: { children: React.ReactNode }) {
    const [displayMode, setDisplayMode] = useState<DisplayMode>()
    const onDisplayModeChange = (mode: DisplayMode) => {
        console.log(`???onDisplayModeChange:${mode} `)
        setDisplayMode(mode)
    }


    return (
        <NextUIProvider>
            <Installer onDisplayModeChange={onDisplayModeChange} />
            {
                displayMode !== DisplayMode.BROWSER &&
                <React.Fragment>{children}</React.Fragment>
            }
        </NextUIProvider>
    );
}