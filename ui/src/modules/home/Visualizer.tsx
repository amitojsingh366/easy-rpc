import React, { FC } from "react";

export const Visualizer: FC = () => {
    return (
        <div className="hidden lg:flex flex-col items-center justify-center w-full">
            <div className="shadow-lg w-96 h-96 bg-discord-black rounded-lg">
                <div className="bg-discord-blurple h-16 rounded-t-lg " >
                    <div className="w-24 h-24 rounded-full bg-discord-lightGrey 
             border-6 border-discord-black relative top-5 left-4" >
             <div className=" w-7 h-7 rounded-full bg-discord-green
             border-4 border-discord-black relative float-right mt-16 "/>
             </div>

            
                    <div className=" text-white px-5 py-8">
                        USERNAME
                    </div>
                    <div className=" px-5 pt-5 text-xs font-black text-discord-lightGrey">
                        PLAYING A GAME
                    </div>
                    <div className=" flex flex-row  px-5 py-2 gap-2">
                        <div className=" w-20 h-20   rounded bg-discord-lightGrey relative ">

                        </div>
                        <div> <div className=" text-xs  font-black text-discord-lightGrey">
                            With ur heart
                        </div>
                        <div className="  text-sm text-discord-lightGrey">
                            Competitive<br />
                            Party size<br />
                            Time
                        </div></div>
                    </div>
                    <div className="px-5">
                        <button className="  bg-discord-lightGrey w-80 h-10 items-center justify-center  rounded-md"> Ask to Join
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}