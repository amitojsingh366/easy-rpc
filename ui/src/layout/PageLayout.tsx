import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";

export type PageLayoutProps = DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
> & {}

export const PageLayout: FC<PageLayoutProps> = ({
    children,
    className,
}) => {
    return (
        <div className={`bg-discord-grey w-full h-auto min-h-full flex p-5 pt-4 ${className}`}>
            {children}
        </div>
    )
}
