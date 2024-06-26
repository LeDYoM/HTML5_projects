window.onload = function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Game variables
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 1.0;
    let dy = -1.0;
    let previousDelta = 0.0;
    const ballRadius = 10;

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
    }

    function draw(_timeStamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        let currentDelta = (_timeStamp - previousDelta);
        previousDelta = _timeStamp;
        currentDelta = 1.0;
        x += (dx * currentDelta);
        y += (dy * 13.3);

        console.log(currentDelta);

        // Bounce off the walls
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
            dy = -dy;
        }

        requestAnimationFrame(draw);
    }

    draw(0.0);
};
