import React, { createContext, Dispatch, FC, SetStateAction, useMemo, useState } from "react";


export const VisualizerContext = createContext<{
    profileName: string,
    applicationId: string;
    state: string;
    details: string;
    startTimestamp: string;
    stopTimestamp: string;
    largeImageKey: string;
    largeImageText: string;
    smallImageKey: string;
    smallImageText: string;
    partyId: string;
    partySize: string;
    partyMax: string;
    joinSecret: string;
    button1Label: string;
    button1Url: string;
    button2Label: string;
    button2Url: string;
    setProfileName: Dispatch<SetStateAction<string>>;
    setApplicationId: Dispatch<SetStateAction<string>>;
    setDetails: Dispatch<SetStateAction<string>>;
    setState: Dispatch<SetStateAction<string>>;
    setStartTimestamp: Dispatch<SetStateAction<string>>;
    setStopTimestamp: Dispatch<SetStateAction<string>>;
    setLargeImageKey: Dispatch<SetStateAction<string>>;
    setLargeImageText: Dispatch<SetStateAction<string>>;
    setSmallImageKey: Dispatch<SetStateAction<string>>;
    setSmallImageText: Dispatch<SetStateAction<string>>;
    setPartyId: Dispatch<SetStateAction<string>>;
    setPartySize: Dispatch<SetStateAction<string>>;
    setPartyMax: Dispatch<SetStateAction<string>>;
    setJoinSecret: Dispatch<SetStateAction<string>>;
    setButton1Label: Dispatch<SetStateAction<string>>;
    setButton1Url: Dispatch<SetStateAction<string>>;
    setButton2Label: Dispatch<SetStateAction<string>>;
    setButton2Url: Dispatch<SetStateAction<string>>;
}>({
    profileName: "",
    applicationId: "",
    state: "",
    details: "",
    startTimestamp: "",
    stopTimestamp: "",
    largeImageKey: "",
    largeImageText: "",
    smallImageKey: "",
    smallImageText: "",
    partyId: "",
    partySize: "",
    partyMax: "",
    joinSecret: "",
    button1Label: "",
    button1Url: "",
    button2Label: "",
    button2Url: "",
    setProfileName: () => { },
    setApplicationId: () => { },
    setDetails: () => { },
    setState: () => { },
    setStartTimestamp: () => { },
    setStopTimestamp: () => { },
    setLargeImageKey: () => { },
    setLargeImageText: () => { },
    setSmallImageKey: () => { },
    setSmallImageText: () => { },
    setPartyId: () => { },
    setPartySize: () => { },
    setPartyMax: () => { },
    setJoinSecret: () => { },
    setButton1Label: () => { },
    setButton1Url: () => { },
    setButton2Label: () => { },
    setButton2Url: () => { },
});

export const VisualizerProvider: FC = ({ children }) => {
    const [profileName, setProfileName] = useState("");
    const [applicationId, setApplicationId] = useState("");
    const [details, setDetails] = useState("");
    const [state, setState] = useState("");
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

    return (
        <VisualizerContext.Provider
            value={useMemo(
                () => ({
                    profileName, applicationId,
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
                    setButton2Label, setButton2Url,
                }),
                [profileName, applicationId,
                    details, state,
                    startTimestamp, stopTimestamp,
                    largeImageKey, largeImageText,
                    smallImageKey, smallImageText,
                    partyId, partySize,
                    partyMax, joinSecret,
                    button1Label, button1Url,
                    button2Label, button2Url,]
            )}>
            {children}
        </VisualizerContext.Provider>
    )
}

