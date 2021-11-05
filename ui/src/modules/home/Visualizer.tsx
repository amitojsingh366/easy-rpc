import React, { FC, useContext, useEffect, useState } from "react";
import { ElaspedTime } from "../../components/ElaspedTime";
import type { AppAsset, UserData } from "../../types/types";
import { VisualizerContext } from "./VisualizerProvider";

export const Visualizer: FC = () => {
    // @ts-ignore
    const { ipcRenderer } = window.require('electron');

    const { applicationId, details, state, largeImageKey, smallImageKey, joinSecret, stopTimestamp,
        button1Label, button1Url, button2Label, button2Url, startTimestamp, largeImageText, smallImageText } = useContext(VisualizerContext);
    const [appName, setAppName] = useState("");
    const [appAssets, setAppAssets] = useState<AppAsset[]>([]);
    const [lastRequest, setLastRequest] = useState(0);
    const [userTag, setUserTag] = useState(["Username", "#0000"]);
    const [userAvatar, setUserAvatar] = useState("");

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

    useEffect(() => {
        ipcRenderer.on("@visualizer/profile", (event: any, data: UserData) => {
            setUserAvatar(data.avatar);
            setUserTag(data.userTag);
        })
    }, [])

    return (
        <div className="hidden lg:flex flex-col items-center justify-center w-full h-screen">
            <div className="shadow-lg bg-discord-black rounded-lg">
                <div className="bg-discord-blurple h-16 rounded-t-lg " >
                    <div className="w-24 h-24 rounded-full bg-discord-lightGrey 
             border-6 border-discord-black relative top-5 left-4"
                        style={{
                            backgroundImage: `url(${userAvatar})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover"
                        }}
                    >
                        <div className=" w-7 h-7 rounded-full bg-discord-green2
             border-4 border-discord-black relative float-right mt-16 "/>
                    </div>
                </div>


                <p className="text-white px-5 py-8 inline-flex font-black">
                    {userTag[0]}<p className="pt-1 font-normal text-sm text-gray-400">{userTag[1]}</p>
                </p>
                <div className="px-5 pt-2 text-xs font-black text-gray-400">
                    PLAYING A GAME
                </div>
                <div className=" flex flex-row  px-5 py-2 gap-2">
                    {largeImageKey ? <div className="w-20 h-20 rounded-lg mb-2"
                        title={largeImageText}
                        style={{
                            backgroundImage: `url(${"https://cdn.discordapp.com/app-assets/" + applicationId + "/" +
                                appAssets.find((asset) => asset.name === largeImageKey)?.id
                                + ".png"})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover"
                        }}
                    >
                        {smallImageKey ?
                            <img className="w-6 h-6 rounded-full object-cover relative
                       left-16 top-16 border-3 border-discord-black bg-discord-black"
                                src={`https://cdn.discordapp.com/app-assets/${applicationId}/${appAssets.find((asset) => asset.name === smallImageKey)?.id}.png`}
                                alt={smallImageText} title={smallImageText} /> : null}
                    </div> : null}


                    <div className="flex flex-col justify-center mb-2">
                        <p className="text-sm font-black text-gray-400">
                            {appName}
                        </p>
                        <p className="text-sm text-gray-400">{details}</p>
                        <p className="text-sm text-gray-400">{state}</p>
                        {startTimestamp || stopTimestamp ? <ElaspedTime
                            className="text-sm text-gray-400"
                            startTime={new Date(Number(startTimestamp))}
                            endTime={stopTimestamp !== "" ?
                                new Date(Number(stopTimestamp)) : undefined} /> : null}
                    </div>
                </div>
                <div className="px-5 pb-5">
                    {joinSecret ? <button className="bg-discord-lightGrey2 w-80 h-10 items-center 
                        justify-center text-white rounded-md hover:bg-gray-500"> Ask to Join
                    </button> : <div className="flex flex-col space-y-2">
                        {button1Label && button1Url ?
                            <button className="bg-discord-lightGrey2 w-80 h-10 items-center 
                        justify-center text-white rounded-md hover:bg-gray-500"
                                onClick={() => {
                                    window.location.href = button1Url
                                }}
                            >{button1Label}
                            </button> : null}
                        {button2Label && button2Url ? <button className="bg-discord-lightGrey2 w-80 h-10 items-center 
                        justify-center text-white rounded-md hover:bg-gray-500"
                            onClick={() => {
                                window.location.href = button2Url
                            }}
                        >{button2Label}
                        </button> : null}
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}