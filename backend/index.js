const   express = require ('express');
const	app = express();
const	server = require('http').createServer(app);
const	io = require ('socket.io')(server, { cors: { origin: "*" }});
const	cg = require ('./createGame');
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

function	createGame () {
	return [cg.getBall (), cg.getFirstPlayer (), cg.getSecondPlayer ()];
}

function	matchPlayer() {
	console.log (playerQueue);
	while (playerQueue.length >= 2) {
		console.log (playerQueue);
		const	fplayer = playerQueue.shift();
  		const	splayer = playerQueue.shift();
		let		data = {
			url: `./game.html`,
			firstPlayer: cg.getFirstPlayer(),
			secondPlayer: cg.getSecondPlayer(),
			ball: cg.getBall(),
		}
		data.firstPlayer.name = fplayer.name;
		data.firstPlayer.id = fplayer.id;
		data.secondPlayer.name = splayer.name;
		data.secondPlayer.id = splayer.id;
		console.log (io.sockets.sockets.get(fplayer.id));
		const	fplayerSocket = io.sockets.sockets.get(fplayer.id);
		const	splayerSocket = io.sockets.sockets.get(splayer.id);
		fplayerSocket.emit (`startGame`, data);
		splayerSocket.emit (`startGame`, data);
	}
}

app.post('/joinQueue', (req, res) => {
	const	player = {
		name: req.body.name,
		id: req.body.id,
	};
	playerQueue.push(player);
	console.log (playerQueue);
	res.status(201).send({ message: 'Joined queue successfully' });
});

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
