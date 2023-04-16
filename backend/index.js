const   express = require ('express');
const	app = express();
const	server = require('http').createServer(app);
const	io = require ('socket.io')(server, { cors: { origin: "*" }});
const	db = require ('./queries');
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
		const	fplayerSocket = io.sockets.sockets.get(fplayer.id);
		const	splayerSocket = io.sockets.sockets.get(splayer.id);
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

server.listen (1337, () => {
	console.log ('Server listening on port 1337');
});

io.on('connection', (socket) => {
	socket
	socket.on('disconnect', () => {
		playerQueue = playerQueue.filter ((v, i, a) => {
			return v.id != socket.id;
		});
	});
});

setInterval (matchPlayer, 1000);
