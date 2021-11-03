import React, { DetailedHTMLProps, Dispatch, FC, InputHTMLAttributes, ReactNode, SetStateAction, useState } from "react";

export type InputProps = DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
> & {
    placeholder?: string
    value: string,
    IconButton?: ReactNode,
    setValue: Dispatch<SetStateAction<string>>,
}

export const Input: FC<InputProps> = ({
    value,
    setValue,
    IconButton,
    className = "",
    ...props
}) => {
    const [inFocus, setInFocus] = useState(false);
    return (
        <div className={`inline-flex bg-transparent h-11 w-56 border
         ${inFocus ? 'border-discord-blurple' : 'border-discord-lightBlack hover:border-black'}
         transition-colors duration-200 rounded-lg`}>
            <input className={`bg-transparent  outline-none 
         h-11 ${IconButton ? 'w-48' : 'w-56'} text-white pl-4 pr-4 font-normal ${className}`}
                value={value}
                alt={value}
                onChange={(e) => { setValue(e.target.value) }}
                onFocus={() => { setInFocus(true) }}
                onBlur={() => { setInFocus(false) }}
                {...props}
            />
            {IconButton ? IconButton : null}
        </div>
    );
}