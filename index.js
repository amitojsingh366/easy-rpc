var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

const path = __importDefault(require("path"));
const express = __importDefault(require("express"));
const bodyParser = require('body-parser');
const fs = require('fs');
var multer = require('multer');
var upload = multer();

const port = 6968;

const app = express.default();

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

var started = false;
let buttons = [];
app.set('view engine', 'ejs');
app.set('views', path.default.join(__dirname, './views'))
app.use('/static', express.default.static(path.default.join(__dirname, './static')));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload.array());

app.get('/', async(req, res, next) => {
    configData = await JSON.parse(fs.readFileSync(config_path));
    configData.running = started;
    res.render('home', { data: configData });
});



app.post('/update', async(req, res, next) => {
    if (!started) {
        if (req.body.button_1_label) {
            buttons.push({ label: req.body.button_1_label, url: req.body.button_1_url });
        }
        if (req.body.button_2_label) {
            buttons.push({ label: req.body.button_2_label, url: req.body.button_2_url });
        }
        await fs.writeFileSync(config_path, JSON.stringify(req.body));
        await RPC(req.body);
        started = true;

    }
    res.redirect('/');
});

app.post('/disconnect', async(req, res, next) => {
    res.redirect('/');
    process.exit();
});

app.post('/clear', async(req, res, next) => {
    let data = { token: "" }
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
        console.log(`User has requested to join.\nUser Details:\n${user}`)
    });

    var presenceData = await cleanData(data);
    if (buttons.length != 0) {
        presenceData.buttons = buttons;
    }
    presenceData.instance = true;
    if (data.pid && data.psize && data.pmax && data.joinSecret) {
        presenceData.matchSecret = randomString(8);
        presenceData.spectateSecret = randomString(8);
    }
    client.on('connected', () => {
        console.log('Connected To Discord!');
        client.updatePresence(presenceData);
    });

    process.on('unhandledRejection', console.error);
}

async function cleanData(obj) {
    for (var n in obj) {
        if (obj[n] === null || obj[n] === undefined || obj[n] === '') {
            delete obj[n];
        }
    }
    return obj
}
async function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}