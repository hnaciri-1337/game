const	second = document.querySelector ("#second");
const	play = document.querySelector ("#play");
const	canvas = document.getElementById('pong');
const	ctx = canvas.getContext('2d');

const image = new Image();
image.src = `./background/1.jpg`;

function	drawBackground()
{
	ctx.beginPath();
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	ctx.closePath();
}

function	drawLineCircle(ball)
{
	ctx.beginPath();
	ctx.setLineDash([10, 10]);
	ctx.strokeStyle = "WHITE";
	ctx.lineWidth = 1;
	ctx.arc(canvas.width / 2, canvas.height / 2, ball.radius * 15, 0, 2 * Math.PI);
	ctx.moveTo(canvas.width / 2, 0);
  	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();
	ctx.setLineDash([]);
	ctx.closePath();
}

function	drawPlayer(player)
{
	ctx.beginPath();
	ctx.fillStyle = player.color;
	ctx.fillRect(player.x, player.y, player.width, player.height);
	ctx.lineWidth = 1;
	ctx.strokeStyle = player.reverseColor;
	ctx.strokeRect(player.x - 1, player.y - 1, player.width + 2, player.height + 2);
	ctx.closePath();
}

function	drawBall(ball)
{
	ctx.beginPath();
	ctx.fillStyle = ball.color;
	ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.strokeStyle = ball.reverseColor;
	ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.closePath();
}

function	drawScore(player, left)
{
	ctx.beginPath();
	ctx.fillStyle = player.reverseColor;
	ctx.font = "430% cursive";
	if (left === true)
	{
		ctx.fillText(player.score.toString(), (canvas.width * 5) / 100, (canvas.height * 15) / 100);
		ctx.fillStyle = player.color;
		ctx.font = "400% cursive";
		ctx.fillText(player.score.toString(), (canvas.width * 5) / 100, (canvas.height * 15) / 100);
	}
	else
	{
		ctx.fillText(player.score.toString(), (canvas.width * 91) / 100, (canvas.height * 15) / 100);
		ctx.fillStyle = player.color;
		ctx.font = "400% cursive";
		ctx.fillText(player.score.toString(), (canvas.width * 91) / 100, (canvas.height * 15) / 100);
	}
	ctx.closePath();
}

async function	draw2d()
{
	let values = await Promise.all([getBall(), getPlayer(true), getPlayer(false)]);
	drawBackground();
	drawLineCircle(values[0]);
	drawScore(values[1], true);
	drawScore(values[2], false);
	drawPlayer(values[1]);
	drawPlayer(values[2]);
	drawBall(values[0]);
}

async function	getPlayer(firstPlayer) {
	let	path;
	if (firstPlayer)
		path = `http://localhost:1337/player1/${canvas.width}/${canvas.height}`;
	else
		path = `http://localhost:1337/player2/${canvas.width}/${canvas.height}`;
	let	response = await fetch(path);
	response = await response.json();
	return response;
}

async function	getBall() {
	let	path = `http://localhost:1337/ball/${canvas.width}/${canvas.height}/30`;
	let	response = await fetch(path);
	response = await response.json();
	return response;
}

draw2d();
