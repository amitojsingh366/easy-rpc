import React, { useState, useEffect, useContext } from 'react';
import { ProfileContext } from './modules/ProfileProvider';

export default function Home() {
    // @ts-ignore
    const { ipcRenderer } = window.require('electron');
    const [version, setVersion] = useState("");

    const { profile } = useContext(ProfileContext);

    useEffect(() => {
        ipcRenderer.send("@app/version");
        ipcRenderer.on("@app/version", (event: any, version: string) => {
            setVersion(version)
        })
    }, [])

    return (
        <div className="bg-gray-900 w-full h-full flex flex-col items-center p-5 pt-6">
            <p className="text-white font-black text-4xl">Easy RPC</p>
            <p className="text-xs text-gray-400 font-black p-2">v{version}</p>

            <p>profile: {profile?.name}</p>
        </ div>
    );
}

