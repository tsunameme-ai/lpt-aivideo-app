'use client'
import { Button, Spinner } from '@nextui-org/react';
import { usePrivy } from '@privy-io/react-auth'

export default function Page() {
    const { ready, authenticated, login, user, logout } = usePrivy()
    return (
        <>
            {
                ready ?
                    <>
                        {authenticated && user ? <>
                            <p>UserId:<br /><code>{user.id}</code></p>
                            <p>
                                User Info: <br />
                                <code>{JSON.stringify(user, null, 2)}</code>
                            </p>
                            <Button onPress={logout}>Logout</Button>
                        </>
                            :
                            <Button onPress={login}>Login</Button>
                        }
                    </>
                    : <Spinner />
            }
        </>
    )
}