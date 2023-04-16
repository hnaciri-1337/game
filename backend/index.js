const   express = require ('express');
const	app = express();
const	server1 = require('http').createServer(app);
const	server2 = require('http').createServer(app);
const	io1 = require ('socket.io')(server1, { cors: { origin: "*" }});
const	io2 = require ('socket.io')(server2, { cors: { origin: "*" }});
const	db = require ('./queries');
const	cg = require ('./calculeGame');
let		playerQueue = [];

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use (express.json());
app.use (express.urlencoded({extended: true}));
app.use (express.text());

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const charactersLength = characters.length;
    while (length--)
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

function	matchPlayer() {
	while (playerQueue.length >= 2) {
		const	fplayer = playerQueue.shift();
  		const	splayer = playerQueue.shift();
		const	id = makeId (20);
		let		url = `./game.html?gameId=${id}`;
		const	fplayerSocket = io1.sockets.sockets.get(fplayer.id);
		const	splayerSocket = io1.sockets.sockets.get(splayer.id);
		if (db.addGame (id, fplayer.name, splayer.name) == false)
			return ;
		fplayerSocket.emit (`startGame`, url);
		splayerSocket.emit (`startGame`, url);
	}
}

app.post('/joinQueue', (req, res) => {
	const	player = {
		name: req.body.name,
		id: req.body.id,
	};
	playerQueue.push(player);
	res.status(201).send({ message: 'Joined queue successfully' });
});

app.get('/createGame/:width/:height/:speed', db.createGame);
app.get('/findGame/:id', db.getGameInfo);

server1.listen (1337, () => {
	console.log ('Server1 listening on port 1337');
});

server2.listen (3000, () => {
	console.log ('Server2 listening on port 3000');
});

io1.on('connection', (socket) => {
	socket.on('disconnect', () => {
		playerQueue = playerQueue.filter ((v, i, a) => {
			return v.id != socket.id;
		});
	});
});

io2.on('connection', (socket) => {
	socket.on ('update', (data) => {
		data = JSON.parse (data);
		cg.Update (data[0], data[1], data[2], data[3]);
		socket.broadcast.emit ('newPosition', JSON.stringify (data));
		socket.emit ('newPosition', JSON.stringify (data));
	});
});

setInterval (matchPlayer, 1000);
