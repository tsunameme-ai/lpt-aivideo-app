import { Spacer } from "@nextui-org/react"
interface ErrorComponentProps {
    errorMessage: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = (props: ErrorComponentProps) => {
    return (
        <div hidden={props.errorMessage.length == 0}>
            <Spacer y={1} />
            <p className='text-tiny text-danger'>{props.errorMessage}</p>
            <Spacer y={4} />
        </div>
    );
};

export default ErrorComponent