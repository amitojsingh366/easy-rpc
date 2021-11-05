import React, {
    DetailedHTMLProps, Dispatch, FC, InputHTMLAttributes,
    ReactNode, SetStateAction, useState
} from "react";

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
    children,
    className = "",
    ...props
}) => {
    const [inFocus, setInFocus] = useState(false);
    return (
        <div className={`flex flex-row bg-transparent h-11 w-56 border
         ${inFocus ? 'border-discord-blurple' : 'border-discord-lightBlack hover:border-black'}
         transition-colors duration-200 rounded-lg`}>
            <input className={`bg-transparent  outline-none 
         h-11 ${children ? 'w-42' : 'w-56'} text-white pl-4 font-normal ${className}`}
                value={value}
                title={value}
                onChange={(e) => { setValue(e.target.value) }}
                onFocus={() => { setInFocus(true) }}
                onBlur={() => { setInFocus(false) }}
                {...props}
            />
            <div className="flex flex-row-reverse w-full pr-2 space-x-1">
                {children}
            </div>
        </div>
    );
}