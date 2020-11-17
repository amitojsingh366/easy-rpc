var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

const path = __importDefault(require("path"));
const express = __importDefault(require("express"));
const bodyParser = require('body-parser');
const fs = require('fs'); //fs.existsSync fs.readFileSync fs.writeFileSync
var multer = require('multer');
var upload = multer();

const port = 6968;

const app = express.default();

//const config_path = path.default.join(__dirname, './easyRPC-config.json');
const config_path = './easyRPC-config.json';

try {
    if (!fs.existsSync(config_path)) {
        fs.writeFileSync(config_path, JSON.stringify({ token: "" }));
    }
} catch (e) {
    console.error(e);
    console.log('Please try again in administrator mode');
    process.exit();
}


var configData = JSON.parse(fs.readFileSync(config_path));
var token = configData.token;

var started = false;

app.set('view engine', 'ejs');
app.set('views', path.default.join(__dirname, './views'))
app.use('/static', express.default.static(path.default.join(__dirname, './static')));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload.array());

app.get('/', async(req, res, next) => {
    configData = await JSON.parse(fs.readFileSync(config_path));
    var data = {
        token: configData.token,
        state: configData.state,
        details: configData.details,
        starttime: configData.starttime,
        stoptime: configData.stoptime,
        limgkey: configData.limgkey,
        limgtxt: configData.limgtxt,
        simgkey: configData.simgkey,
        simgtxt: configData.simgtxt,
        pid: configData.pid,
        psize: configData.psize,
        pmax: configData.pmax,
        jsecret: configData.jsecret,
        running: started
    }
    res.render('home', { data: data });
});



app.post('/update', async(req, res, next) => {
    if (!started) {
        var data = {
            token: req.body.token,
            state: req.body.state,
            details: req.body.details,
            starttime: req.body.starttime,
            stoptime: req.body.stoptime,
            limgkey: req.body.limgkey,
            limgtxt: req.body.limgtxt,
            simgkey: req.body.simgkey,
            simgtxt: req.body.simgtxt,
            pid: req.body.pid,
            psize: req.body.psize,
            pmax: req.body.pmax,
            jsecret: req.body.jsecret
        }
        await fs.writeFileSync(config_path, JSON.stringify(data));
        await RPC(data);
        started = true;
    }
    res.redirect('/');
});

app.post('/disconnect', async(req, res, next) => {
    res.redirect('/');
    process.exit();
});

app.post('/clear', async(req, res, next) => {
    var data = { token: "" }
    await fs.writeFileSync(config_path, JSON.stringify(data));
    res.redirect('/');
});

app.get('/help', async(req, res, next) => {
    res.render('help');
});


app.listen(port, () => console.log(`Server Running\nGo to http://localhost:${port} to get started`));


async function RPC(data) {
    const client = require('discord-rich-presence')(data.token);

    client.on('join', (secret) => {
        console.log('we should join with', secret);
    });

    client.on('spectate', (secret) => {
        console.log('we should spectate with', secret);
    });

    client.on('joinRequest', (user) => {
        if (user.discriminator === '1337') {
            client.reply(user, 'YES');
        } else {
            client.reply(user, 'IGNORE');
        }
    });

    var presenceData = {}
    if (data.state) {
        presenceData.state = data.state;
    }
    if (data.details) {
        presenceData.details = data.details;
    }
    if (data.starttime) {
        presenceData.startTimestamp = Number(data.starttime);
    }
    if (data.stoptime) {
        presenceData.endTimestamp = Number(data.stoptime);
    }
    if (data.limgkey) {
        presenceData.largeImageKey = data.limgkey;
    }
    if (data.limgtxt) {
        presenceData.largeImageText = data.limgtxt;
    }
    if (data.simgkey) {
        presenceData.smallImageKey = data.simgkey;
    }
    if (data.simgtxt) {
        presenceData.smallImageText = data.simgtxt;
    }
    if (data.pid) {
        presenceData.partyId = data.pid;
    }
    if (data.psize) {
        presenceData.partySize = Number(data.psize);
    }
    if (data.pmax) {
        presenceData.partyMax = Number(data.pmax);
    }
    if (data.jsecret) {
        presenceData.joinSecret = data.jsecret;
    }
    presenceData.instance = true;
    presenceData.matchSecret = 'NNmfnNsak';
    presenceData.spectateSecret = 'kLopNq';
    client.on('connected', () => {
        console.log('Connected To Discord!');
        client.updatePresence(presenceData);
    });

    process.on('unhandledRejection', console.error);




}