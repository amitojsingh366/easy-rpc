import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

export enum ButtonVariant {
    red = 'bg-transparent border-discord-red hover:bg-discord-red',
    redFilled = 'border-discord-red hover:border-discord-lightRed bg-discord-red hover:bg-discord-lightRed',
    blurple = 'bg-transparent border-discord-blurple hover:bg-discord-blurple',
    blurpleFilled = "border-discord-blurple hover:border-discord-lightBlurple bg-discord-blurple hover:bg-discord-lightBlurple"
}

export type ButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    variant?: ButtonVariant
}

export const Button: FC<ButtonProps> = ({
    onClick,
    children,
    variant = ButtonVariant.blurple,
    className = "",
}) => {
    return (
        <button className={`rounded-full text-white 
        w-28 pt-2 pb-2 border ${variant} ${className}`}
            onClick={onClick}
        >{children}</button>
    );
}