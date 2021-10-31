import React, { useState, useEffect, useContext } from 'react';
import { Input } from './components/Input';
import { ProfileContext } from './modules/ProfileProvider';
import { Selection } from './components/Selection';
import type { Profile } from './types/types';
import { IconButton, IconButtonVariants } from './components/IconButton';

export default function Home() {
    // @ts-ignore
    const { ipcRenderer } = window.require('electron');
    const [version, setVersion] = useState("");

    const {
        profile, profiles, currentProfileId,
        setCurrentProfileId, updateProfile, createProfile, deleteProfile
    } = useContext(ProfileContext);

    useEffect(() => {
        ipcRenderer.send("@app/version");
        ipcRenderer.on("@app/version", (event: any, version: string) => {
            setVersion(version)
        })
    }, [])

    // feild values
    const [profileName, setProfileName] = useState("");
    const [applicationId, setApplicationId] = useState("");
    const [details, setDetails] = useState("")
    const [state, setState] = useState("")
    const [startTimestamp, setStartTimestamp] = useState("")
    const [stopTimestamp, setStopTimestamp] = useState("")
    const [largeImageKey, setLargeImageKey] = useState("")
    const [largeImageText, setLargeImageText] = useState("");
    const [smallImageKey, setSmallImageKey] = useState("");
    const [smallImageText, setSmallImageText] = useState("");
    const [partyId, setPartyId] = useState("");
    const [partySize, setPartySize] = useState("");
    const [partyMax, setPartyMax] = useState("");
    const [joinSecret, setJoinSecret] = useState("");
    const [button1Label, setButton1Label] = useState("");
    const [button1Url, setButton1Url] = useState("");
    const [button2Label, setButton2Label] = useState("");
    const [button2Url, setButton2Url] = useState("");

    useEffect(() => {
        setProfileName(profile?.name || "");
        setApplicationId(profile?.data?.token || "");
        setDetails(profile?.data?.details || "");
        setState(profile?.data?.state || "");
        setStartTimestamp(profile?.data?.startTimestamp || "");
        setStopTimestamp(profile?.data?.endTimestamp || "");
        setLargeImageKey(profile?.data?.largeImageKey || "");
        setLargeImageText(profile?.data?.largeImageText || "");
        setSmallImageKey(profile?.data?.smallImageKey || "");
        setSmallImageText(profile?.data?.smallImageText || "");
        setPartyId(profile?.data?.partyId || "");
        setPartySize(profile?.data?.partySize || "");
        setPartyMax(profile?.data?.partyMax || "");
        setJoinSecret(profile?.data?.joinSecret || "");

        setButton1Label(profile?.data?.button_1_label || "");
        setButton1Url(profile?.data?.button_1_url || "");
        setButton2Label(profile?.data?.button_2_label || "");
        setButton2Url(profile?.data?.button_2_url || "");
    }, [profile]);

    const save = () => {
        const newProfile: Profile = {
            id: currentProfileId || "",
            name: profileName,
            data: {
                token: applicationId,
                state,
                details,
                startTimestamp,
                endTimestamp: stopTimestamp,
                largeImageKey,
                largeImageText,
                smallImageKey,
                smallImageText,
                partyId,
                partySize,
                partyMax,
                joinSecret,
                button_1_label: button1Label,
                button_1_url: button1Url,
                button_2_label: button2Label,
                button_2_url: button2Url,
            }
        }

        updateProfile(newProfile.id, newProfile);
    }

    const start = () => {
        save();
        ipcRenderer.send("@rpc/update", profile?.data);
    }

    return (
        <div className="bg-discord-grey w-full h-full flex flex-col items-center p-5 pt-6">
            <p className="text-white font-black text-4xl p-5">Easy RPC</p>
            {version ? <p className="text-xs text-gray-400 font-black p-2">v{version}</p> : null}

            <div className="flex flex-row gap-x-2">
                <Selection
                    value={currentProfileId || ""}
                    setValue={setCurrentProfileId}
                    options={profiles ? profiles.map((p) => {
                        return {
                            value: p.id,
                            text: p.name || "",
                            selected: p.id === currentProfileId
                        }
                    }) : []}
                />
                <IconButton
                    icon="add_circle_outline"
                    className="mt-2"
                    onClick={() => { createProfile() }} />
                <IconButton
                    icon="file_upload"
                    className="mt-2" />
                <IconButton
                    icon="file_download"
                    className="mt-2" />
                <IconButton
                    icon="delete_outline"
                    className="mt-2"
                    variant={IconButtonVariants.red}
                    onClick={() => { deleteProfile(currentProfileId || "") }} />
            </div>


            <div className="flex flex-row flex-wrap gap-x-2 justify-center pt-10">
                <Input placeholder="Profile Name" value={profileName} setValue={setProfileName} />
                <Input placeholder="Application ID" value={applicationId} setValue={setApplicationId} />
                <Input placeholder="Details" value={details} setValue={setDetails} />
                <Input placeholder="State" value={state} setValue={setState} />
                <Input placeholder="Start Time" value={startTimestamp} setValue={setStartTimestamp} />
                <Input placeholder="Stop Time" value={stopTimestamp} setValue={setStopTimestamp} />
                <Input placeholder="Large Image Key" value={largeImageKey} setValue={setLargeImageKey} />
                <Input placeholder="Large Image Text" value={largeImageText} setValue={setLargeImageText} />
                <Input placeholder="Small Image Key" value={smallImageKey} setValue={setSmallImageKey} />
                <Input placeholder="Small Image Text" value={smallImageText} setValue={setSmallImageText} />
                <Input placeholder="Party ID" value={partyId} setValue={setPartyId} />
                <Input placeholder="Party Size" value={partySize} setValue={setPartySize} />
                <Input placeholder="Party Max" value={partyMax} setValue={setPartyMax} />
                <Input placeholder="Join Secret" value={joinSecret} setValue={setJoinSecret} />
            </div>
            <p className="inline-flex pt-5">Buttons: <IconButton className="ml-2" icon="add_circle_outline" /></p>
            <div className="flex flex-row flex-wrap gap-x-2 justify-center pt-2">
                <Input placeholder="Button Label" value={button1Label} setValue={setButton1Label} />
                <Input placeholder="Button Url" value={button1Url} setValue={setButton1Url} />
                <Input placeholder="Button Label" value={button2Label} setValue={setButton2Label} />
                <Input placeholder="Button Url" value={button2Url} setValue={setButton2Url} />
            </div>

            <button onClick={start}>Start</button>

        </ div>
    );
}

