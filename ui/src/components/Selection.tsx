import React, { DetailedHTMLProps, Dispatch, FC, InputHTMLAttributes, SetStateAction } from "react";
import type { SelectionOption } from "../types/types";

export type SelectionProps = DetailedHTMLProps<
    InputHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
> & {
    placeholder?: string,
    options: SelectionOption[]
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
}

export const Selection: FC<SelectionProps> = ({
    value,
    setValue,
    options,
    className = "",
}) => {
    return (
        <select className={`bg-transparent border-discord-lightBlack border hover:border-black 
        focus:border-discord-blurple outline-none transition-colors duration-200
        rounded-lg h-11 w-56 text-white pl-4 font-normal ${className}`}
            value={value}
            onChange={(e) => { setValue(e.target.value) }}
        >
            {options && options.map((op) =>
                <option className="text-white bg-discord-grey"
                    value={op.value}
                    selected={op.selected}
                    key={op.value}>{op.text}</option>)}
        </select>
    );
}