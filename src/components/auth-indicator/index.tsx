'use client'
import { usePrivy, User } from '@privy-io/react-auth'
import { Spinner, Link } from '@nextui-org/react';
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
                            <Link
                                onPress={logout}
                                color="foreground"
                                className="w-full"
                                href='#'
                            >
                                <div className="text-[20px] leading-10">
                                    Logout (<span className='text-[15px]'>{formatUserInfo(user)}</span>)
                                </div>
                            </Link>
                        </>
                            :
                            <>
                                <Link
                                    onPress={login}
                                    color="foreground"
                                    className="w-full"
                                    href='#'
                                >
                                    <div className="text-[20px] leading-10">
                                        Login
                                    </div>
                                </Link>

                            </>
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