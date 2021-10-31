export interface Profile {
    id: string;
    name: string | undefined;
    data?: ProfileData
}

export interface ProfileData {
    token: string | undefined;
    state: string | undefined;
    details: string | undefined;
    startTimestamp: string | undefined;
    endTimestamp: string | undefined;
    largeImageKey: string | undefined;
    largeImageText: string | undefined;
    smallImageKey: string | undefined;
    smallImageText: string | undefined;
    partyId: string | undefined;
    partySize: string | undefined;
    partyMax: string | undefined;
    joinSecret: string | undefined;
    button_1_label: string | undefined;
    button_1_url: string | undefined;
    button_2_label: string | undefined;
    button_2_url: string | undefined;
}


export interface SelectionOption {
    value: string,
    text: string,
    selected: boolean
}