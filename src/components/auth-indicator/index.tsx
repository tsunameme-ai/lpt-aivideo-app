'use client'
import { usePrivy, User } from '@privy-io/react-auth'
import { Button, Spinner } from '@nextui-org/react';
import AuthPromo from './promo';

const AuthIndicator: React.FC = () => {
    const { ready, authenticated, login, user, logout } = usePrivy()
    const formatUserInfo = (user: User): string => {
        if (user.wallet) {
            return `${user.wallet.address.substring(0, 6).toLowerCase()}...${user.wallet.address.substring(user.wallet.address.length - 4, user.wallet.address.length).toLowerCase()}`
        }
        if (user.email) {
            return user.email.address
        }
        if (user.discord) {
            return user.discord.username || user.discord.email || user.discord.subject
        }
        if (user.google) {
            return user.google.name || user.google.email || user.google.subject
        }
        return user.id
    }
    return (
        <>
            {
                ready ?
                    <>
                        {authenticated && user ? <>
                            <p>Logged in as: {formatUserInfo(user)}</p>
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
export {
    AuthIndicator,
    AuthPromo
}