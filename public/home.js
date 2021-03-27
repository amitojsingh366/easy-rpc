const {
    ipcRenderer
} = window.require('electron');
let b1l = ""
let b1u = ""
let b2l = ""
let b2u = ""


function loadProfiles(select) {
    let selector = document.getElementById("profiles");
    selector.options.length = 0;
    if (!localStorage.getItem("@rpc/profiles")) {
        let p = [{
            id: "default",
            name: "Default Profile",
        }];
        localStorage.setItem("@rpc/profiles", JSON.stringify(p));
    }
    let profiles = localStorage.getItem("@rpc/profiles");
    profiles = JSON.parse(profiles);
    if (profiles.length === 0) {
        profiles = [{
            id: "default",
            name: "Default Profile",
        }]
    }
    for (let index = 0; index < profiles.length; index++) {
        const profile = profiles[index];
        let opt = document.createElement("option");
        if (profile.id === select) {
            opt.selected = true;
        }
        opt.value = profile.id;
        opt.text = profile.name;
        selector.appendChild(opt);
    }

    loadProfile(select);
}

function loadProfile(profileID) {
    let profiles = localStorage.getItem("@rpc/profiles");
    profiles = JSON.parse(profiles);
    let profile = profiles.find((p) => p.id == profileID);
    if (profile.data) {
        let data = profile.data;
        document.getElementById("profileName").value = profile.name;
        document.getElementById("token").value = data.token
        document.getElementById("state").value = data.state
        document.getElementById("details").value = data.details
        document.getElementById("startTimestamp").value = data.startTimestamp
        document.getElementById("endTimestamp").value = data.endTimestamp
        document.getElementById("largeImageKey").value = data.largeImageKey
        document.getElementById("largeImageText").value = data.largeImageText
        document.getElementById("smallImageKey").value = data.smallImageKey
        document.getElementById("smallImageText").value = data.smallImageText
        document.getElementById("partyId").value = data.partyId
        document.getElementById("partySize").value = data.partySize
        document.getElementById("partyMax").value = data.partyMax
        document.getElementById("joinSecret").value = data.joinSecret

        if (data.button_1_label) {
            b1l = data.button_1_label;
        }
        if (data.button_1_url) {
            b1u = data.button_1_url
        }
        if (data.button_2_label) {
            b2l = data.button_2_label;
        }
        if (data.button_2_url) {
            b2u = data.button_2_url
        }

        if (b1l && b1u) {
            addButton();
        }
        if (b2l && b2u) {
            addButton();
        }
    } else {
        document.getElementById("profileName").value = "";
        document.getElementById("token").value = "";
        document.getElementById("state").value = "";
        document.getElementById("details").value = "";
        document.getElementById("startTimestamp").value = "";
        document.getElementById("endTimestamp").value = "";
        document.getElementById("largeImageKey").value = "";
        document.getElementById("largeImageText").value = "";
        document.getElementById("smallImageKey").value = "";
        document.getElementById("smallImageText").value = "";
        document.getElementById("partyId").value = "";
        document.getElementById("partySize").value = "";
        document.getElementById("partyMax").value = "";
        document.getElementById("joinSecret").value = "";
        b1l = "";
        b1u = "";
        b2l = "";
        b2u = "";
        if (document.getElementById("button_1_label")) {
            document.getElementById("button_1_label").remove();
        }
        if (document.getElementById("button_1_url")) {
            document.getElementById("button_1_url").remove();
        }
        if (document.getElementById("button_2_label")) {
            document.getElementById("button_2_label").remove();
        }
        if (document.getElementById("button_2_url")) {
            document.getElementById("button_2_url").remove();
        }
    }
}

function createProfile() {
    let id = randomString(8);
    let profiles = localStorage.getItem("@rpc/profiles");
    profiles = JSON.parse(profiles);
    let profile = {
        id: id,
        name: "New Profile"
    }
    profiles.push(profile);
    localStorage.setItem("@rpc/profiles", JSON.stringify(profiles));
    loadProfiles(id);
}

function deleteProfile(id) {
    let profiles = localStorage.getItem("@rpc/profiles");
    profiles = JSON.parse(profiles);
    let i = profiles.indexOf(profiles.find((p) => p.id == id))
    profiles.splice(i, 1);
    console.log(profiles);
    localStorage.setItem("@rpc/profiles", JSON.stringify(profiles));
    loadProfiles("default");
}

function onLoad() {
    ipcRenderer.send("@rpc/status", "");
    setInterval(() => {
        ipcRenderer.send("@rpc/status", "");
    }, 2500)

    ipcRenderer.on("@rpc/status", (event, isRunning) => {
        if (isRunning) {
            document.getElementById("is-running-banner").style.display = 'inherit';
        } else {
            document.getElementById("is-running-banner").style.display = 'none';
        }
    })
    if (localStorage.getItem("@app/shouldDock")) {
        document.getElementById("should-dock-checkbox").checked = JSON.parse(localStorage.getItem("@app/shouldDock"));
    } else {
        document.getElementById("should-dock-checkbox").checked = true;
    }

    ipcRenderer.on("@app/shouldDock", (event, args) => {
        ipcRenderer.send("@app/shouldDock", document.getElementById("should-dock-checkbox").checked);
    });

    let lp = "default";
    if (localStorage.getItem("@app/lastProfile")) {
        lp = localStorage.getItem("@app/lastProfile");
    }

    loadProfiles(lp);
}

function clearData() {
    localStorage.clear();
}

function saveData() {
    let data = {
        token: document.getElementById("token").value,
        state: document.getElementById("state").value,
        details: document.getElementById("details").value,
        startTimestamp: document.getElementById("startTimestamp").value,
        endTimestamp: document.getElementById("endTimestamp").value,
        largeImageKey: document.getElementById("largeImageKey").value,
        largeImageText: document.getElementById("largeImageText").value,
        smallImageKey: document.getElementById("smallImageKey").value,
        smallImageText: document.getElementById("smallImageText").value,
        partyId: document.getElementById("partyId").value,
        partySize: document.getElementById("partySize").value,
        partyMax: document.getElementById("partyMax").value,
        joinSecret: document.getElementById("joinSecret").value,
    }

    if (document.getElementById("button_1_label") || document.getElementById("button_1_url")) {
        data.button_1_label = document.getElementById("button_1_label").value;
        data.button_1_url = document.getElementById("button_1_url").value;
    }

    if (document.getElementById("button_2_label") || document.getElementById("button_2_url")) {
        data.button_2_label = document.getElementById("button_2_label").value;
        data.button_2_url = document.getElementById("button_2_url").value;
    }

    let profileID = document.getElementById("profiles").value;
    let profiles = localStorage.getItem("@rpc/profiles");
    profiles = JSON.parse(profiles);
    let profile = profiles.find((p) => p.id == profileID);
    if (data) {
        profile.data = data;
    }
    profile.name = document.getElementById("profileName").value;
    console.log(profiles);
    localStorage.setItem("@rpc/profiles", JSON.stringify(profiles));
    localStorage.setItem("@app/lastProfile", profile.id);
}

function submitData() {
    let data = {
        token: document.getElementById("token").value,
        state: document.getElementById("state").value,
        details: document.getElementById("details").value,
        startTimestamp: document.getElementById("startTimestamp").value,
        endTimestamp: document.getElementById("endTimestamp").value,
        largeImageKey: document.getElementById("largeImageKey").value,
        largeImageText: document.getElementById("largeImageText").value,
        smallImageKey: document.getElementById("smallImageKey").value,
        smallImageText: document.getElementById("smallImageText").value,
        partyId: document.getElementById("partyId").value,
        partySize: document.getElementById("partySize").value,
        partyMax: document.getElementById("partyMax").value,
        joinSecret: document.getElementById("joinSecret").value,
    }

    if (document.getElementById("button_1_label") || document.getElementById("button_1_url")) {
        data.button_1_label = document.getElementById("button_1_label").value;
        data.button_1_url = document.getElementById("button_1_url").value;
    }

    if (document.getElementById("button_2_label") || document.getElementById("button_2_url")) {
        data.button_2_label = document.getElementById("button_2_label").value;
        data.button_2_url = document.getElementById("button_2_url").value;
    }

    let profileID = document.getElementById("profiles").value;
    let profiles = localStorage.getItem("@rpc/profiles");
    profiles = JSON.parse(profiles);
    let profile = profiles.find((p) => p.id == profileID);
    if (data) {
        profile.data = data;
    }
    console.log(profiles);
    profile.name = document.getElementById("profileName").value;
    localStorage.setItem("@rpc/profiles", JSON.stringify(profiles));
    localStorage.setItem("@app/lastProfile", profile.id);
    ipcRenderer.send("@rpc/update", data);
}


function addButton() {
    let btn_div = document.getElementById('buttons');
    if (document.getElementById('button_1_label')) {
        if (document.getElementById('button_2_label')) {
            document.getElementById('2-btn-err').style.display = 'inherit';
        } else {
            btn_div.append(document.createElement('br'));
            let input = document.createElement('input');
            let input_2 = document.createElement('input');
            input.type = 'text';
            input.name = 'button_2_label';
            input.id = 'button_2_label';
            input.className = 'input-feild';
            input.placeholder = 'Button Label';
            input.value = b2l;
            input_2.type = 'text';
            input_2.name = 'button_2_url';
            input_2.id = 'button_2_url';
            input_2.className = 'input-feild';
            input_2.placeholder = 'Button Url';
            input_2.value = b2u;
            btn_div.append(input);
            btn_div.append(input_2);
        }
    } else {
        let input = document.createElement('input');
        let input_2 = document.createElement('input');
        input.type = 'text';
        input.name = 'button_1_label';
        input.id = 'button_1_label';
        input.className = 'input-feild';
        input.placeholder = 'Button Label';
        input.value = b1l;
        input_2.type = 'text';
        input_2.name = 'button_1_url';
        input_2.id = 'button_1_url';
        input_2.className = 'input-feild';
        input_2.placeholder = 'Button Url';
        input_2.value = b1u;
        btn_div.append(input);
        btn_div.append(input_2);
    }
}

function goHelp() {
    ipcRenderer.send("@window/navigate", "help.html");
}

function goQuit() {
    ipcRenderer.send("@app/quit", true);
}

function updateShouldDock() {
    localStorage.setItem("@app/shouldDock", document.getElementById("should-dock-checkbox").checked);
    ipcRenderer.send("@app/shouldDock", document.getElementById("should-dock-checkbox").checked);
}


function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}