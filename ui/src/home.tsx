import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react';
import { Input } from './components/Input';
import { ProfileContext } from './modules/ProfileProvider';
import { Selection } from './components/Selection';
import type { Profile } from './types/types';
import { IconButton, IconButtonVariants } from './components/IconButton';
import { Button, ButtonSize, ButtonVariant } from './components/Button';
import { Switch } from './components/Switch';

export default function Home() {
    // @ts-ignore
    const { ipcRenderer } = window.require('electron');
    const [version, setVersion] = useState("");

    const autoLaunchKey = "@app/autoLaunch";
    const appDockKey = "@app/shouldDock";

    const appDockRef = useRef<HTMLInputElement>(null);
    const autoLaunchRef = useRef<HTMLInputElement>(null);

    const {
        profile, profiles, currentProfileId, clearData,
        setCurrentProfileId, updateProfile, createProfile, deleteProfile,
    } = useContext(ProfileContext);

    useLayoutEffect(() => {
        ipcRenderer.send("@app/version");
        ipcRenderer.on("@app/version", (event: any, version: string) => {
            setVersion(version)
        })

        const savedAppDock = localStorage.getItem(appDockKey);
        if (!appDockRef.current) return;
        if (savedAppDock) {
            appDockRef.current.checked = JSON.parse(savedAppDock);
        } else {
            appDockRef.current.checked = true;
        }

        const savedAutoLaunch = localStorage.getItem(autoLaunchKey);
        if (!autoLaunchRef.current) return;
        if (savedAutoLaunch) {
            autoLaunchRef.current.checked = JSON.parse(savedAutoLaunch);
        } else {
            autoLaunchRef.current.checked = false;
        }
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

    const [showButton1Fields, setShowButton1Fields] = useState(false);
    const [showButton2Fields, setShowButton2Fields] = useState(false);

    useEffect(() => {
        setShowButton1Fields(button1Label !== "" || button1Url !== "")
        setShowButton2Fields(button2Label !== "" || button2Url !== "")
    }, [button1Label, button1Url, button2Label, button2Url])

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

    const addButton = () => {
        if (!showButton1Fields && !showButton2Fields) setShowButton1Fields(true);
        if (showButton1Fields && !showButton2Fields) setShowButton2Fields(true);
    }

    const toggleAppDock = () => {
        if (!appDockRef.current) return;
        localStorage.setItem(appDockKey, JSON.stringify(appDockRef.current.checked));
        ipcRenderer.send(appDockKey, appDockRef.current.checked);
    }
    const toggleAutoLaunch = () => {
        if (!autoLaunchRef.current) return;
        localStorage.setItem(autoLaunchKey, JSON.stringify(autoLaunchRef.current.checked));
        ipcRenderer.send(autoLaunchKey, autoLaunchRef.current.checked);
    }

    return (
        <div className="bg-discord-grey w-full h-auto min-h-full flex flex-col items-center p-5 pt-4">
            <p className="text-white font-black text-4xl p-5">Easy RPC</p>
            {version ? <p className="text-xs text-gray-400 font-black pb-2">v{version}</p> : null}

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


            <div className="flex flex-row flex-wrap gap-x-2 justify-center pt-6">
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
            <p className="inline-flex pt-2 text-white">Buttons: <IconButton
                className="ml-2"
                onClick={addButton}
                icon="add_circle_outline"
            /></p>
            <div className={`flex flex-row flex-wrap gap-x-2 justify-center pt-2 ${!showButton1Fields ? 'hidden' : ''}`}>
                <Input placeholder="Button Label" value={button1Label} setValue={setButton1Label} />
                <Input placeholder="Button Url" value={button1Url} setValue={setButton1Url} />
            </div>

            <div className={`flex flex-row flex-wrap gap-x-2 justify-center ${!showButton2Fields ? 'hidden' : ''}`}>
                <Input placeholder="Button Label" value={button2Label} setValue={setButton2Label} />
                <Input placeholder="Button Url" value={button2Url} setValue={setButton2Url} />
            </div>

            <div className="flex flex-row gap-x-2 p-8 pb-4">
                <Button onClick={save}>Save</Button>
                <Button onClick={start} variant={ButtonVariant.blurpleFilled}>Start</Button>
            </div>

            <Button onClick={() => {
                ipcRenderer.send("@app/quit", true)
            }} variant={ButtonVariant.redFilled}>Quit</Button>

            <div className="p-4 text-discord-lightGrey text-sm text-center">
                <p>Work by <a href="https://amitoj.net">Amitoj Singh</a></p>
                <p>View the source code <a href="https://github.com/amitojsingh366/easy-rpc">here</a></p>
                <p>Don't know what's going on? Check the <button className="fakeA">help section</button></p>

                <p className="mt-1">Dock to system tray: <Switch fref={appDockRef} onClick={toggleAppDock} /></p>
                <p>Auto launch on startup: <Switch fref={autoLaunchRef} onClick={toggleAutoLaunch} /></p>

                <Button onClick={clearData} className="mt-2" variant={ButtonVariant.grey} size={ButtonSize.tiny}>Clear Data</Button>
            </div>

        </div>
    );
}

