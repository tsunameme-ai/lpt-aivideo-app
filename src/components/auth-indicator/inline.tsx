'use client'
import { Spacer } from '@nextui-org/react';
import { User, getAccessToken, useLogin, usePrivy } from '@privy-io/react-auth'
import { useEffect } from 'react';
import { SecondaryButton } from '../buttons';

interface AuthPromoProps {
    onLoginComplete: (userId: string, accessToken: string) => void
    onLoginFailed: (message: string) => void
}
const AuthInline: React.FC<AuthPromoProps> = (props: AuthPromoProps) => {
    const { authenticated, user } = usePrivy()
    const { login } = useLogin({
        onComplete: async (user: User) => {
            onLoginComplete(user.id)
        },
        onError: (e: any) => {
            if (e === 'exited_auth_flow') {
                //user cancelled
            }
            else {
                props.onLoginFailed(`Oops. Login failed.`)
            }
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
            {(!authenticated || !user) &&
                <>
                    <Spacer y={4} />
                    <SecondaryButton onPress={logInIfNot}>{authenticated && user ? 'Save' : 'Login to save'}</SecondaryButton>
                </>
            }
        </>
    )
}
export default AuthInline