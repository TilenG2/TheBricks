function drawIt() {
    var powerbar = document.getElementById('powerbar');
    var x = 200,
        y = 200,
        dx = 4,
        dy = 1,
        WIDTH,
        HEIGHT,
        r = 10,
        ctx,
        upDown = false,
        downDown = false,
        // canvasMinY,
        // canvasMaxY,
        paddley,
        paddleh,
        paddlew,
        bricks,
        NROWS,
        NCOLS,
        BRICKWIDTH,
        BRICKHEIGHT,
        row,
        col,
        beforerow,
        rowheight,
        colwidth,
        countToFinish = 0,
        paddelBounceCount = 0,
        powerup = false,
        powerupActive = false,
        powerbarSize = 10;

    var brick = new Image();
    brick.src = "img/deepslate_brick.png";
    var brickBreak = new Image();
    brickBreak.src = "img/deepslate_brick_break.png";
    var knight = new Image();
    knight.src = "img/knight.png";


    var cannon = new Image();
    cannon.src = "img/cannon.png";
    var cannonDX = 5,
        cannonX = -689;

    function init() {
        ctx = $('#canv')[0].getContext("2d");
        WIDTH = $("#canv").width();
        HEIGHT = $("#canv").height();
        init_paddle();
        // startAnim();
        return setInterval(draw, 10);

    }

    // function startAnim() {
    //     while (true) {
    //         print("anim");
    //         delay(100);
    //         ctx.drawImage(cannon, HEIGHT / 2 + 161, cannonX, 689, 323);
    //         cannonX += cannonDX;
    //     }
    // }

    // function delay(time) {
    //     return new Promise(resolve => setTimeout(resolve, time));
    // }

    function init_paddle() {
        paddley = HEIGHT / 2;
        paddleh = 100;
        paddlew = 66;
    }

    function circle(x, y, r, color) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    function rect(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }

    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    function draw() {
        clear();
        if (countToFinish <= 0) {
            console.log("finish")
        }
        powerupDestroy();

        if (downDown) { //paddel movment arows in omejevanje
            if ((paddley + paddleh) < HEIGHT) {
                paddley += 5;
            } else {
                paddley = HEIGHT - paddleh;
            }
        } else if (upDown) {
            if ((paddley + paddleh / 4) > 0) {
                paddley -= 5;
            } else {
                paddley = 0 - paddleh / 4;
            }
        }
        ctx.drawImage(knight, 0, paddley, paddlew, paddleh);
        //rect(0, paddley, paddlew, paddleh); //paddle draw

        //riši opeke
        for (i = 0; i < NROWS; i++) {
            for (j = 1; j <= NCOLS; j++) {
                if (bricks[i][j - 1] == 2) {
                    // rect((WIDTH - j * (BRICKWIDTH )) ,
                    //     (i * (BRICKHEIGHT )) ,
                    //     BRICKWIDTH, BRICKHEIGHT);
                    ctx.drawImage(brick, (WIDTH - j * (BRICKWIDTH)), (i * (BRICKHEIGHT)), BRICKWIDTH, BRICKHEIGHT);
                } else if (bricks[i][j - 1] == 1) {
                    ctx.drawImage(brickBreak, (WIDTH - j * (BRICKWIDTH)), (i * (BRICKHEIGHT)), BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }

        //unicevanje opek
        beforerow = row;
        rowheight = BRICKHEIGHT; //Smo zadeli opeko?
        colwidth = BRICKWIDTH;
        row = Math.floor((y + dy * 7.5) / rowheight);
        col = Math.floor(((WIDTH - x) - dx * 2.5) / colwidth);

        if (row < 0) row = 0;
        if (row > NROWS - 1) row = NROWS - 1;

        //Če smo zadeli opeko, vrni povratno kroglo in označi v tabeli, da opeke ni več
        if (bricks[row][col] > 0) {
            if (!powerupActive)
                if (beforerow < row || beforerow > row) {
                    dy = -dy;
                } else {
                    dx = -dx;
                }
            bricks[row][col]--;
            countToFinish--;
        }

        //odboj zogice
        if (y + dy > HEIGHT - r || y + dy < r)
            dy = -dy;

        if (x + dx > WIDTH - r)
            dx = -dx;
        else if (x + dx - paddlew < r) { //odboj od ploscka
            if (y > (paddley + paddleh / 4) && y < paddley + paddleh) {
                dy = 6 * ((y - ((paddley + paddleh / 4) + paddleh / 3)) / paddleh);
                dx = -dx;
                powerupActive = false;
                paddelBounceCount++;
            } else
                clearInterval(inter);
        }
        x += dx;
        y += dy;
    }

    function powerupDestroy() {
        if (paddelBounceCount > 10) {
            powerup = true;
            powerbar.style.backgroundColor = 'yellow';
            powerbar.style.width = '100%';
        } else if (paddelBounceCount < 10) {
            powerup = false;
            powerbar.style.width = (powerbarSize * paddelBounceCount) + '%';
            powerbar.style.backgroundColor = 'blue';
        }
        if (powerupActive)
            circle(x, y, r, 'red'); // Zogica
        else
            circle(x, y, r, 'black'); // Zogica
    }

    function onKeyDown(evt) {
        if (evt.keyCode == 38 || evt.keyCode == 87)
            upDown = true;
        else if (evt.keyCode == 40 || evt.keyCode == 83)
            downDown = true;
        else if (evt.keyCode == 32 && powerup) {
            powerupActive = true;
            paddelBounceCount = 0;
        }
    }

    function onKeyUp(evt) {
        if (evt.keyCode == 38 || evt.keyCode == 87)
            upDown = false;
        else if (evt.keyCode == 40 || evt.keyCode == 83)
            downDown = false;
    }

    // function init_mouse() {
    //     canvasMinY = $("#canv").offset().left + (paddleh / 2);
    //     canvasMaxY = canvasMinY + HEIGHT;
    // }

    // function onMouseMove(evt) {
    //     if (evt.pageY > canvasMinY && evt.pageY < canvasMaxY) {
    //         paddley = evt.pageY - canvasMinY;
    //     }
    // }


    function initbricks() { //inicializacija opek - polnjenje v tabelo
        NROWS = 15;
        NCOLS = 3;
        BRICKWIDTH = 100;
        BRICKHEIGHT = (HEIGHT / NROWS);
        bricks = new Array(NROWS);
        for (i = 0; i < NROWS; i++) {
            bricks[i] = new Array(NCOLS);
            for (j = 0; j < NCOLS; j++) {
                bricks[i][j] = 2;
                countToFinish += bricks[i][j];
            }
        }
        countToFinish *= 0.9;
    }

    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);
    // $(document).mousemove(onMouseMove);

    init();
    // init_mouse();
    initbricks();
}