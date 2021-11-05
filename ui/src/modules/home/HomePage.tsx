import React, { FC, useState, useEffect, useContext, useRef, useLayoutEffect, useCallback } from "react"
import { Input } from '../../components/Input';
import { ProfileContext } from '../../modules/ProfileProvider';
import { Selection } from '../../components/Selection';
import type { Profile } from '../../types/types';
import { IconButton, IconButtonVariants } from '../../components/IconButton';
import { Button, ButtonSize, ButtonVariant } from '../../components/Button';
import { Switch } from '../../components/Switch';
import { Link } from 'react-router-dom';
import { VisualizerContext } from "./VisualizerProvider";


export const HomePage: FC = () => {
    // @ts-ignore
    const { ipcRenderer } = window.require('electron');
    const [version, setVersion] = useState("");
    const [rpcStarted, setRpcStarted] = useState(false);

    const autoLaunchKey = "@app/autoLaunch";
    const appDockKey = "@app/shouldDock";

    const appDockRef = useRef<HTMLInputElement>(null);
    const autoLaunchRef = useRef<HTMLInputElement>(null);

    const {
        profile, profiles, currentProfileId, clearData, importProfile, exportProfile,
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

        ipcRenderer.send("@rpc/status", "");
        setInterval(() => {
            ipcRenderer.send("@rpc/status", "");
        }, 2500)

        ipcRenderer.on("@rpc/status", (event: any, isRunning: boolean) => {
            setRpcStarted(isRunning);
        })
    }, []);

    useLayoutEffect(() => {
        if (!profile || !autoLaunchRef.current || !appDockRef.current || rpcStarted) return;
        ipcRenderer.send("@window/loaded");

        ipcRenderer.on("@app/started", (event: any, args: any) => {
            if (!appDockRef.current || !autoLaunchRef.current || !profile) return;
            if (appDockRef.current.checked && autoLaunchRef.current.checked) {
                ipcRenderer.send("@rpc/dockAndStart", JSON.stringify(profile?.data));
            }
        });

        ipcRenderer.on("@app/shouldDock", (event: any, args: any) => {
            if (!appDockRef.current) return;
            ipcRenderer.send("@app/shouldDock", appDockRef.current.checked);
        });

        ipcRenderer.on("@app/autoLaunch", (event: any, args: any) => {
            if (!autoLaunchRef.current) return;
            ipcRenderer.send("@app/autoLaunch", autoLaunchRef.current.checked);
        });
    }, [profile, autoLaunchRef.current, appDockRef.current, rpcStarted])

    // feild values
    const { profileName, applicationId,
        details, state,
        startTimestamp, stopTimestamp,
        largeImageKey, largeImageText,
        smallImageKey, smallImageText,
        partyId, partySize,
        partyMax, joinSecret,
        button1Label, button1Url,
        button2Label, button2Url,
        setProfileName, setApplicationId,
        setDetails, setState,
        setStartTimestamp, setStopTimestamp,
        setLargeImageKey, setLargeImageText,
        setSmallImageKey, setSmallImageText,
        setPartyId, setPartySize,
        setPartyMax, setJoinSecret,
        setButton1Label, setButton1Url,
        setButton2Label, setButton2Url } = useContext(VisualizerContext)

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

    const save = (start?: boolean) => {
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
        if (start) ipcRenderer.send("@rpc/update", newProfile.data)
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
        <div className="flex flex-col items-center w-full">
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
                    onClick={createProfile} />
                <IconButton
                    icon="file_upload"
                    className="mt-2"
                    onClick={exportProfile} />
                <IconButton
                    icon="file_download"
                    className="mt-2"
                    onClick={importProfile} />
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
                <Input placeholder="Start Time"
                    value={startTimestamp}
                    type="number"
                    setValue={setStartTimestamp}>
                    <IconButton
                        icon="schedule"
                        className="mt-2"
                        title="Current Time"
                        onClick={() => { setStartTimestamp(Date.now().toString()) }} />
                    <IconButton
                        icon="today"
                        className="mt-2 text-sm"
                        title="Current Local Time"
                        onClick={() => { setStartTimestamp(new Date().setHours(0, 0, 0, 0).toString()) }} />
                </Input>
                <Input placeholder="Stop Time"
                    value={stopTimestamp}
                    type="number"
                    setValue={setStopTimestamp}>
                    <IconButton
                        icon="schedule"
                        className="mt-2"
                        title="Current Time"
                        onClick={() => { setStopTimestamp(Date.now().toString()) }} />
                </Input>
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
                <Button onClick={() => { ipcRenderer.send("@window/change_size") }}>Visualizer</Button>
                <Button onClick={() => { save(false) }}>Save</Button>
                <Button
                    onClick={() => { save(true) }}
                    variant={ButtonVariant.blurpleFilled}>
                    {rpcStarted ? 'Update' : 'Start'}
                </Button>
            </div>

            <Button onClick={() => {
                ipcRenderer.send("@app/quit", true)
            }} variant={ButtonVariant.redFilled}>Quit</Button>

            <div className="p-4 text-discord-lightGrey text-sm text-center">
                <p>Work by <a href="https://amitoj.net">Amitoj Singh</a></p>
                <p>View the source code <a href="https://github.com/amitojsingh366/easy-rpc">here</a></p>
                <p>Don't know what's going on? Check the <Link to="/help" className="fakeA">help section</Link> </p>

                <p className="mt-1">Dock to system tray: <Switch fref={appDockRef} onClick={toggleAppDock} /></p>
                <p>Auto launch on startup: <Switch fref={autoLaunchRef} onClick={toggleAutoLaunch} /></p>

                <Button onClick={clearData} className="mt-2" variant={ButtonVariant.grey} size={ButtonSize.tiny}>Clear Data</Button>
            </div>
        </div>
    )
}