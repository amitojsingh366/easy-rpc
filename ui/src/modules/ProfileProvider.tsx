import React, { createContext, Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import type { Profile } from "../types/types";
import { randomString } from "../util/randomString";

export const ProfileContext = createContext<{
    profile?: Profile,
    profiles?: Profile[],
    currentProfileId?: string,
    setCurrentProfileId: Dispatch<SetStateAction<string>>,
    setProfile: Dispatch<SetStateAction<Profile | undefined>>,
    createProfile: () => void,
    deleteProfile: (id: string) => void,
    updateProfile: (id: string, newProfile: Profile) => void,
    clearData: () => void,
    importProfile: () => void,
    exportProfile: () => void,
}>({
    profile: undefined,
    profiles: undefined,
    currentProfileId: undefined,
    setCurrentProfileId: () => { },
    setProfile: () => { },
    createProfile: () => { },
    deleteProfile: (id: string) => { },
    updateProfile: (id: string, newProfile: Profile) => { },
    clearData: () => { },
    importProfile: () => { },
    exportProfile: () => { },
});

export const ProfileProvider: FC = ({ children }) => {
    const [profile, setProfile] = useState<Profile>();
    const [currentProfileId, setCurrentProfileId] = useState("");
    const [profiles, setProfiles] = useState<Profile[]>();
    const profilesKey = "@rpc/profiles";
    const lastProfileKey = "@app/lastProfile";
    // @ts-ignore
    const { ipcRenderer } = window.require('electron');

    const clearData = () => {
        setProfile(undefined);
        setProfiles([]);
        setCurrentProfileId("");
        localStorage.clear();
    }

    const createProfile = () => {
        const id = randomString(32);
        const newProfile: Profile = {
            id,
            name: 'New Profile',
        }
        setProfiles((p) => p ? p.concat(newProfile) : [newProfile]);
        setCurrentProfileId(id);
    }

    const deleteProfile = (id: string) => {
        if (!profiles || !id) return;
        // @ts-ignore
        const deleteIndex = profiles.indexOf(profiles.find((p) => p.id === id))
        setProfiles((p) => {
            if (!p) return;
            const newP = [...p];
            newP.splice(deleteIndex, 1);
            return newP;
        });
        setCurrentProfileId(profiles[0].id)
    }

    const updateProfile = (id: string, newProfile: Profile) => {
        if (!profiles) return;
        // @ts-ignore
        const updateIndex = profiles.indexOf(profiles.find((p) => p.id == id))
        setProfiles((p) => {
            if (!p) return p;
            const newP = [...p];
            newP[updateIndex] = newProfile;
            return newP;
        })
    }

    const importProfile = () => {
        ipcRenderer.send("@profile/import")
        ipcRenderer.once("@profile/import", (event: any, profileData: string) => {
            const pData: Profile = JSON.parse(profileData);
            setProfiles((p) => p ? p.concat(pData) : [pData]);
            setCurrentProfileId(pData.id);
        })
    }

    const exportProfile = () => {
        if (!profile) return;
        ipcRenderer.send("@profile/export", JSON.stringify(profile))
    }

    useEffect(() => {
        const lastProfileId = localStorage.getItem(lastProfileKey);

        let profiles = localStorage.getItem(profilesKey);
        if (!profiles) return createProfile();

        profiles = JSON.parse(profiles);
        if (!profiles) return;

        setProfiles(profiles as unknown as Profile[]);
        if (!lastProfileId) return;
        setCurrentProfileId(lastProfileId);
    }, [])


    useEffect(() => {
        localStorage.setItem(profilesKey, JSON.stringify(profiles));
    }, [profiles])

    useEffect(() => {
        if (!profiles || !currentProfileId) return;
        const selectedProfile = (profiles).find((p) => p.id === currentProfileId);
        setProfile(selectedProfile);

        localStorage.setItem(lastProfileKey, currentProfileId);
    }, [currentProfileId])


    return (
        <ProfileContext.Provider
            value={useMemo(
                () => ({
                    profile,
                    profiles,
                    currentProfileId,
                    setCurrentProfileId,
                    setProfile,
                    createProfile,
                    deleteProfile,
                    updateProfile,
                    clearData,
                    importProfile,
                    exportProfile
                }),
                [profile, profiles, currentProfileId]
            )}>
            {children}
        </ProfileContext.Provider>
    )
}