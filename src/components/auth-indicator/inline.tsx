'use client'
import { Button } from '@nextui-org/react';
import { getAccessToken, useLogin, usePrivy } from '@privy-io/react-auth'
import { useEffect } from 'react';

interface AuthPromoProps {
    onLoginComplete: (userId: string, accessToken: string) => void
    onLoginFailed: (message: string) => void
}
const AuthInline: React.FC<AuthPromoProps> = (props: AuthPromoProps) => {
    const { authenticated, user } = usePrivy()
    const { login } = useLogin({
        onComplete: async () => {
            console.log(`??????login complete`)
            // onLoginComplete(user.id)
        },
        onError: (error: any) => {
            console.log('???? login failed')
            console.log(error);
            props.onLoginFailed(`Oops. Login failed.`)
        },
    });
    useEffect(() => {
        if (authenticated && user) {
            onLoginComplete(user.id)
        }

    }, [authenticated, user])
    const onLoginComplete = async (userId: string) => {
        const accessToken = await getAccessToken()
        if (accessToken) {
            props.onLoginComplete(userId, accessToken)
        }
        else {
            props.onLoginFailed(`Oops. Unable to get accessToken.`)
        }
    }
    const logInIfNot = async () => {
        if (authenticated && user) {
            onLoginComplete(user.id)
        }
        else {
            login()
        }

    }
    return (
        <>
            <Button onPress={logInIfNot}>{authenticated && user ? 'Claim' : 'Login to claim'}</Button>
        </>
    )
}
export default AuthInline