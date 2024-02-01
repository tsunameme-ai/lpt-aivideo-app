import { Spacer } from "@nextui-org/react"
export enum ErrorComponentStyle {
    Error = 'text-danger',
    Warning = 'text-warning'
}
interface ErrorComponentProps {
    errorMessage: string;
    style?: string
}

const ErrorComponent: React.FC<ErrorComponentProps> = (props: ErrorComponentProps) => {
    return (
        <div hidden={props.errorMessage.length == 0}>
            <Spacer y={1} />
            <p className={`text-tiny ${props.style || ErrorComponentStyle.Error}`}>{props.errorMessage}</p>
            <Spacer y={4} />
        </div>
    );
};

export default ErrorComponent