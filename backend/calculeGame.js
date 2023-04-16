const   cg = require ('./createGame');

function    collision(ball, player, one)
{
    const   b_top = ball.y - ball.radius;
    const   b_bottom = ball.y + ball.radius;
    const   b_left = ball.x - ball.radius;
    const   b_right = ball.x + ball.radius;

    const   p_top = player.y;
    const   p_bottom = player.y + player.height;
    const   p_right = player.x + player.width;
    const   p_left = player.x;

    if (one) return (b_bottom >= p_top && b_left <= p_right && b_top <= p_bottom);
    return (b_bottom >= p_top && b_right >= p_left && b_top <= p_bottom);
}

function    Update(ball, player1, player2, canvas) {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    if (ball.x >= player2.x || ball.x <= player1.x + player1.width)
    {
        if (ball.x <= player1.x + player1.width)
            player2.score++;
        else
            player1.score++;
        const temp = cg.getBall (canvas.width, canvas.height, canvas.speed);
        ball.x = temp.x;
        ball.y = temp.y;
        ball.speedX = temp.speedX;
        ball.speedY = temp.speedY;
        ball.velocityX = temp.velocityX;
        ball.velocityY = temp.velocityY;
        ball.stop = true;
    }
    else if (collision(ball, player1, true) || collision(ball, player2, false)) {ball.velocityX *= -(1 + (ball.speedX / 100)); ball.velocityY *= (1 + (ball.speedY / 100));}
    if (ball.y >= canvas.height || ball.y <= 0) ball.velocityY *= -1;
    if (ball.velocityX >= ball.maxX) ball.velocityX = Math.random() * ball.maxX;
    else if (ball.velocityX <= -ball.maxX) ball.velocityX = -1 * Math.random() * ball.maxX;
    if (ball.velocityY >= ball.maxY) ball.velocityY = ball.maxY;
    else if (ball.velocityY <= -ball.maxY) ball.velocityY = -ball.maxY;
}

module.exports = {
    Update,
}

