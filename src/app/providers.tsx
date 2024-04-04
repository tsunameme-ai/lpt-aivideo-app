// app/providers.tsx
'use client'

import { DisplayMode, Installer } from '@/components/installer';
import { NextUIProvider } from '@nextui-org/react'
import React from 'react';
import { useState } from 'react';


export function Providers({ children }: { children: React.ReactNode }) {
    const [displayMode, setDisplayMode] = useState<DisplayMode>()

    return (
        <NextUIProvider>
            <Installer onDisplayModeChange={setDisplayMode} />
            {
                displayMode !== DisplayMode.BROWSER &&
                <React.Fragment>{children}</React.Fragment>
            }
        </NextUIProvider>
    );
}