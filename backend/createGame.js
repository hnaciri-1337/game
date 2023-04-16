const	obj = require ('./index');

function	getFirstPlayer() {
	const	width = 1920;
	const	height = 1280;
	const	player = {
		name: '',
		id: '',
		width: width - ((99 * width) / 100),
		height: height - ((80 * height) / 100),
		x: 2,
		y: height - ((60 * height) / 100),
		color: `white`,
		score: 0,
	};
	return player;
}

function	getSecondPlayer() {
	const	width = 1920;
	const	height = 1280;
	const	player = {
		name: '',
		id: '',
		width: width - ((99 * width) / 100),
		height: height - ((80 * height) / 100),
		x: width - ((1 * width) / 100) - 2,
		y: height - ((60 * height) / 100),
		color: `white`,
		score: 0,
	};
	return player;
}

function	getBall() {
	const	width = 1920;
	const	height = 1280;
	const	maxSpeed = 30;
	const ball = {
		x: width / 2,
		y: height / 2,
		radius: 15,
		speedX: 5, // 1 to 100
		speedY: 20, // 1 to 100
		velocityX: 0,
		velocityY: 0,
		maxX: maxSpeed, // max speed X from 10 to 50
		maxY: maxSpeed * 1.5, // max speed Y from 10 to 50
		color: `white`,
		stop: false
	};
	if (Math.random() > 0.5)
		ball.velocityX = 5;
	else
		ball.velocityX = -5;
	while (ball.velocityY * 10 < 10 && ball.velocityY * 10 > -10)
	{
		if (Math.random() > 0.5)
			ball.velocityY = (Math.random() * 10) % 5;
		else
			ball.velocityY = -1 * (Math.random() * 10) % 5;
	}
	return ball;
}

module.exports = {
	getFirstPlayer,
	getSecondPlayer,
	getBall,
}
