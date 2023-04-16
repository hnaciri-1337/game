const	first = document.querySelector ("#first");
const	nickname = document.querySelector ("#nickname");
const	match = document.querySelector ("#match");
const	form = document.querySelector ("#form");
const	label = document.querySelector ("label");
const	socket = io ('http://localhost:1337');
var		socketId = '';

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
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

function	update_text()
{
	if (match.innerHTML.length === 18)
		match.innerHTML = 'Matchmaking ';
	match.innerHTML = match.innerHTML + '. ';
	setTimeout (update_text, 600);
}

function	ftError (message) {
	label.innerHTML = `Error: ${message}`;
	label.style.color = 'red';
}

async	function matchMaking() {
	if (nickname.value.length <= 0 || nickname.value.length >= 15) {
		ftError ('0 < length < 15');
		nickname.style.border = '1px solid red';
		return ;
	}
	else if (socketId.length === 0) {
		ftError ('try again later');
		return ;
	}
	const data = {
		name: nickname.value,
		id: socketId,
	};
	let response = await fetch("http://localhost:1337/joinQueue/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	});
	if (response.ok) {
		form.style.display = 'none';
		match.style.display = 'block';
		update_text ();
		setCookie ('name', data.name, 1);
	}
	else
		ftError ('try again later');
}

match.style.display = 'none';

play.addEventListener (`click`, matchMaking);

socket.on ('connect', () => {
	socketId = socket.id;
});

socket.on ('startGame', (url) => {
	document.location = url;
});
