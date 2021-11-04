import React, { FC } from "react";

export const Visualizer: FC = () => {
    return (
        <div className="hidden lg:flex flex-col items-center justify-center w-full">
            <div className="shadow-lg w-96 h-96 bg-discord-black rounded-lg">
                <div className="bg-discord-blurple h-16 rounded-t-lg " >
                    <div className="w-24 h-24 rounded-full bg-discord-lightGrey 
             border-6 border-discord-black relative top-5 left-4" />
                </div>


            </div>
        </div>
    )
}