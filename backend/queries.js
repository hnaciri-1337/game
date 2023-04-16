const	Pool = require ('pg').Pool;
const	cg = require ('./createGame');

const	pool = new Pool ({
	user: 'hnaciri-',
	host: 'localhost',
	database: 'game',
	password: '',
	port: '5432',
});

pool.connect();

function	createRandomGame (width, height, speed) {
	return [cg.getBall (width, height, speed), cg.getFirstPlayer (width, height), cg.getSecondPlayer (width, height)];
}

const	getGameInfo = (req, res) => {
	let	{ id } = req.params;
	pool.query(`SELECT * FROM gameplay WHERE id='${id}'`, (e, r) => {
		if (e || r.rows.length === 0) {
			res.status(500).send(`Internal Server Error`);
			return ;
		}
		res.status(200).json(r.rows);
	});
}

const	addGame = (id, fplayer, splayer) => {
	pool.query(`INSERT INTO gameplay (id, fplayer, splayer) VALUES ('${id}', '${fplayer}', '${splayer}')`, (e, r) => {
		if (e) {
			return false;
		}
		return true;
	});
}

const createGame = (req, res) => {
	let	{ width, height, speed } = req.params;
	res.status(200).json(createRandomGame (Number (width), Number (height), Number (speed)));
}

module.exports = {
	getGameInfo,
	createGame,
	addGame,
}