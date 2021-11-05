import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

export type IconButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    icon: string,
    variant?: IconButtonVariants
}

export enum IconButtonVariants {
    red = 'text-discord-red border-discord-red hover:text-discord-grey hover:bg-discord-red',
    grey = 'text-discord-lightGrey border-discord-lightGrey hover:text-discord-grey hover:bg-discord-lightGrey'
}

export const IconButton: FC<IconButtonProps> = ({
    icon,
    onClick,
    variant = IconButtonVariants.grey,
    className = "",
    ...props
}) => {
    return (
        <span className={`flex items-center justify-center bg-transparent
        material-icons p-2 h-6 w-6 rounded-full cursor-pointer 
        transition-colors duration-150 ${variant} border ${className}`}
            onClick={onClick}
            {...props}
        >{icon}</span>
    );
}