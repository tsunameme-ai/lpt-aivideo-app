import { Button, ButtonProps } from '@nextui-org/react';
import React from 'react';



const PrimaryButton: React.FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <Button size='md' className='w-full font-medium' color='primary' radius='sm' {...props}>
            {children}
        </Button>
    );
};

const SecondaryButton: React.FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <Button size='md' className='w-full font-medium' color='primary' radius='sm' variant='flat' {...props}>
            {children}
        </Button>
    );
};

export {
    PrimaryButton,
    SecondaryButton
}