import React, { FC, useContext, useEffect, useState } from "react";
import { ElaspedTime } from "../../components/ElaspedTime";
import type { AppAsset } from "../../types/types";
import { VisualizerContext } from "./VisualizerProvider";

export const Visualizer: FC = () => {
    const { applicationId, details, state, largeImageKey, smallImageKey, joinSecret, stopTimestamp,
        button1Label, button1Url, button2Label, button2Url, startTimestamp, largeImageText, smallImageText } = useContext(VisualizerContext);
    const [appName, setAppName] = useState("");
    const [appAssets, setAppAssets] = useState<AppAsset[]>([]);
    const [lastRequest, setLastRequest] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setLastRequest(Date.now());
            fetch(`https://discord.com/api/oauth2/applications/${applicationId}/rpc`).then((resp) => {
                if (resp.ok) {
                    resp.json().then((d) => { setAppName(d.name) })
                }
            })
            fetch(`https://discord.com/api/oauth2/applications/${applicationId}/assets`).then((resp) => {
                if (resp.ok) {
                    resp.json().then((d) => {
                        setAppAssets(d)
                    })
                }
            })
        }, Date.now() - lastRequest > 5000 ? 10 : 5000)

    }, [applicationId]);

    return (
        <div className="hidden lg:flex flex-col items-center justify-center w-full h-screen">
            <div className="shadow-lg bg-discord-black rounded-lg">
                <div className="bg-discord-blurple h-16 rounded-t-lg " >
                    <div className="w-24 h-24 rounded-full bg-discord-lightGrey 
             border-6 border-discord-black relative top-5 left-4" >
                        <div className=" w-7 h-7 rounded-full bg-discord-green2
             border-4 border-discord-black relative float-right mt-16 "/>
                    </div>
                </div>


                <p className="text-white px-5 py-8 inline-flex font-black">
                    Username<p className="pt-1 font-normal text-sm text-gray-400">#0000</p>
                </p>
                <div className="px-5 pt-2 text-xs font-black text-gray-400">
                    PLAYING A GAME
                </div>
                <div className=" flex flex-row  px-5 py-2 gap-2">
                    <div className="w-20 h-20 rounded-lg mb-2"
                        title={largeImageText}
                        style={{
                            backgroundImage: `url(${"https://cdn.discordapp.com/app-assets/777902409875324988/" +
                                appAssets.find((asset) => asset.name === largeImageKey)?.id
                                + ".png"})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover"
                        }}
                    >
                        <img className="w-6 h-6 rounded-full object-cover relative
                             left-16 top-16 border-3 border-discord-black bg-discord-black"
                            src={"https://cdn.discordapp.com/app-assets/777902409875324988/" +
                                appAssets.find((asset) => asset.name === smallImageKey)?.id
                                + ".png"
                            } alt={smallImageText} title={smallImageText} />
                    </div>

                    <div>
                        <div className=" text-xs  font-black text-gray-400">
                            {appName}
                        </div>
                        <div className="  text-sm text-gray-400">
                            {details}<br />
                            {state}<br />
                            {startTimestamp || stopTimestamp ? <ElaspedTime startTime={new Date(Number(startTimestamp))} endTime={stopTimestamp !== "" ?
                                new Date(Number(stopTimestamp)) : undefined} /> : null}
                        </div>
                    </div>
                </div>
                <div className="px-5 pb-5">
                    {joinSecret ? <button className="bg-discord-lightGrey2 w-80 h-10 items-center 
                        justify-center text-white rounded-md"> Ask to Join
                    </button> : <div className="flex flex-col space-y-2">
                        {button1Label && button1Url ? <button className="bg-discord-lightGrey2 w-80 h-10 items-center 
                        justify-center text-white rounded-md">{button1Label}
                        </button> : null}
                        {button2Label && button2Url ? <button className="bg-discord-lightGrey2 w-80 h-10 items-center 
                        justify-center text-white rounded-md">{button2Label}
                        </button> : null}
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}