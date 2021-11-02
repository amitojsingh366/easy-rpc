import React, { DetailedHTMLProps, FC, InputHTMLAttributes } from "react";

export type SwitchProps = DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
> & {
    fref: React.LegacyRef<HTMLInputElement>
}

export const Switch: FC<SwitchProps> = ({
    onClick,
    fref,
    className = "",
}) => {
    return (
        <label className="switch">
            <input ref={fref} className="opacity-0 w-0 h-0"
                type="checkbox"
                onClick={onClick} />
            <span className="slider round"></span>
        </label>
    );
}