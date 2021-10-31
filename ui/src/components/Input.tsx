import React, { DetailedHTMLProps, Dispatch, FC, InputHTMLAttributes, SetStateAction } from "react";

export type InputProps = DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
> & {
    placeholder?: string
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
}

export const Input: FC<InputProps> = ({
    value,
    setValue,
    className = "",
    placeholder = ""
}) => {
    return (
        <input className={`bg-transparent border-discord-lightBlack border hover:border-black 
        focus:border-discord-blurple outline-none transition-colors duration-200
        rounded-lg h-11 w-56 text-white pl-4 pr-4 font-normal ${className}`}
            value={value}
            alt={value}
            placeholder={placeholder}
            onChange={(e) => { setValue(e.target.value) }}
        />
    );
}