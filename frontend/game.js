const	players = document.querySelector ('#players');
const	play = document.querySelector ('#play');
const	canvas = document.getElementById('pong');
const	ctx = canvas.getContext('2d');
const	playerName = getCookie ('name');
const	FPS = 60;
var		ball;
var		fplayer;
var		splayer;

const image = new Image();
image.src = `./background/1.jpg`;

function	getQueryParam(name) {
	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);
	return params.get(name);
}

function	setCookie(name, value, days) {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function	getCookie(name) {
    let cookieName = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(";");
  
    for(let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) == " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) == 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return "";
}

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
	ctx.strokeStyle = 'WHITE';
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
	ctx.font = '430% cursive';
	if (left === true)
	{
		ctx.fillText(player.score.toString(), (canvas.width * 5) / 100, (canvas.height * 15) / 100);
		ctx.fillStyle = player.color;
		ctx.font = '400% cursive';
		ctx.fillText(player.score.toString(), (canvas.width * 5) / 100, (canvas.height * 15) / 100);
	}
	else
	{
		ctx.fillText(player.score.toString(), (canvas.width * 91) / 100, (canvas.height * 15) / 100);
		ctx.fillStyle = player.color;
		ctx.font = '400% cursive';
		ctx.fillText(player.score.toString(), (canvas.width * 91) / 100, (canvas.height * 15) / 100);
	}
	ctx.closePath();
}

async function	draw2d()
{
	drawBackground();
	drawLineCircle(ball);
	drawScore(fplayer, true);
	drawScore(splayer, false);
	drawPlayer(fplayer);
	drawPlayer(splayer);
	drawBall(ball);
}

async function	checkGame() {
	let	path = `http://localhost:1337/findGame/${getQueryParam('gameId')}`;
	let	response = await fetch(path);
	if (!response.ok) {
		alert ('no game found');
		window.location = './index.html';
	}
	let	values = await response.json();
    let	fh4 = document.createElement('h4');
	fh4.textContent = values[0]['fplayer'];
	players.appendChild(fh4);
	let	sh4 = document.createElement('h4');
	sh4.textContent = values[0]['splayer'];
	players.appendChild(sh4);
	path = `http://localhost:1337/createGame/${canvas.width}/${canvas.height}/30`;
	response = await fetch(path);
	values = await response.json();
	ball = values[0];
	fplayer = values[1];
	splayer = values[2];
	fplayer.name = fh4.textContent;
	splayer.name = sh4.textContent;
}

async	function startGame() {
	await checkGame ();
	await draw2d ();
	setInterval (draw2d, 1000 / FPS);
}

canvas.addEventListener("mousemove", (event) => {
	if (fplayer.name === playerName) {
		let y = (event.clientY - canvas.offsetTop) / canvas.offsetHeight * 100;
		y = y * canvas.height / 100;
		fplayer.y = y - fplayer.height / 2;
		if (fplayer.y < 0)
			fplayer.y = 2;
		else if (fplayer.y > canvas.height - fplayer.height)
			fplayer.y = canvas.height - fplayer.height - 2;
	}
	else if (splayer.name === playerName) {
		let y = (event.clientY - canvas.offsetTop) / canvas.offsetHeight * 100;
		y = y * canvas.height / 100;
		splayer.y = y - splayer.height / 2;
		if (splayer.y < 0)
			splayer.y = 2;
		else if (splayer.y > canvas.height - splayer.height)
			splayer.y = canvas.height - splayer.height - 2;
	}
});

startGame ();
