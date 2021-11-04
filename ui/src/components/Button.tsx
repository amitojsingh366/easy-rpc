import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

export enum ButtonVariant {
    red = 'bg-transparent border-discord-red hover:bg-discord-red',
    redFilled = 'border-discord-red hover:border-discord-lightRed bg-discord-red hover:bg-discord-lightRed',
    blurple = 'bg-transparent border-discord-blurple hover:bg-discord-blurple',
    blurpleFilled = "border-discord-blurple hover:border-discord-lightBlurple bg-discord-blurple hover:bg-discord-lightBlurple",
    grey = 'bg-transparent border-discord-lightGrey hover:bg-discord-lightGrey',
}

export enum ButtonSize {
    default = 'pt-2 pb-2 w-28',
    tiny = 'pt-0.5 pb-0.5 pl-3 pr-3 text-xs'
}

export type ButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    variant?: ButtonVariant
    size?: ButtonSize
}

export const Button: FC<ButtonProps> = ({
    onClick,
    children,
    variant = ButtonVariant.blurple,
    size = ButtonSize.default,
    className = "",
}) => {
    return (
        <button className={`rounded-full text-white ${size}
         transition-colors duration-150 border ${variant} ${className}`}
            onClick={onClick}
        >{children}</button>
    );
}