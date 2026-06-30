import Image from "next/image";

type ServiceFlowLogoProps = {
    className?: string;
    priority?: boolean;
    };

    export default function ServiceFlowLogo({
    className = "h-9 w-auto",
    priority = false,
    }: ServiceFlowLogoProps) {
    return (
        <Image
        src="/Logo.png"
        alt="ServiceFlow logo"
        width={280}
        height={388}
        priority={priority}
        className={`object-contain ${className}`}
        />
    );
}