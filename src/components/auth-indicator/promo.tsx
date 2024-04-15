'use client'
import { useLogin } from '@privy-io/react-auth'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useState } from 'react';
import { appFont } from '@/app/fonts';

interface AuthPromoProps {
    onContinueWOLogin: () => void
    onLoginComplete: () => void
}
const AuthPromo: React.FC<AuthPromoProps> = (props: AuthPromoProps) => {
    const [isOpen] = useState<boolean>(true)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const onClose = () => {
        props.onContinueWOLogin()
    }
    const { login } = useLogin({
        onComplete: () => {
            props.onLoginComplete()
        },
        onError: (error: any) => {
            console.log(error);
            setErrorMessage(`Oops. Login failed.`)
        },
    });
    return (
        <Modal
            className={`${appFont.className}`}
            size='xs'
            placement='center'
            isDismissable={false}
            isOpen={isOpen}
            onClose={onClose} >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Login</ModalHeader>
                        <ModalBody>
                            {errorMessage ? <p color="danger" >{errorMessage}</p>
                                : <p>
                                    Login to save the GIF into your own account
                                </p>}

                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Continue without login
                            </Button>
                            <Button color="primary" onPress={login}>
                                Login
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
export default AuthPromo