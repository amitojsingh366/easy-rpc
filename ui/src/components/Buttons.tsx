import React, { ButtonHTMLAttributes, DetailedHTMLProps, Dispatch, FC, SetStateAction } from "react";

export type ButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {

}

export const Button: FC<ButtonProps> = ({
    onClick,
    className = "",
}) => {
    return (
        <button className={`bg-transparent border-discord-lightBlack border hover:border-black 
        focus:border-discord-blurple outline-none transition-colors duration-200
        rounded-lg h-11 w-56 text-white pl-4 font-normal ${className}`}
            onClick={onClick}
        ></button>
    );
}