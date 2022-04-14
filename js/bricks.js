function credits() {
    document.getElementById('menu').style = "display: none";
    document.getElementById('difficulty').style = "display: none";
    document.getElementById('credits').style = "display: flex";
}

function rules() {
    document.getElementById('menu').style = "display: none";
    document.getElementById('difficulty').style = "display: none";
    document.getElementById('rules').style = "display: flex";
}

function back() {
    document.getElementById('difficulty').style = "display: flex";
    document.getElementById('credits').style = "display: none";
    document.getElementById('rules').style = "display: none";
    document.getElementById('menu').style = "display: flex";
}
var difficulty = 2;

function diffselect(dif) {
    difficulty = dif;
    document.getElementById("easy").classList.remove("selected");
    document.getElementById("medium").classList.remove("selected");
    document.getElementById("hard").classList.remove("selected");

    switch (dif) {
        case 1:
            document.getElementById("easy").classList.add("selected");
            break;
        case 2:
            document.getElementById("medium").classList.add("selected");
            break;
        case 3:
            document.getElementById("hard").classList.add("selected");
            break;
    }
}


function drawIt() {
    document.getElementById('game').style = "display: flex";
    document.getElementById('menu').style = "display: none";
    document.getElementById('difficulty').style = "display: none";
    document.getElementById('bgimage2').style = "display: flex";
    var powerbar = document.getElementById('powerbar');
    var livebar = document.getElementById('health');
    var x = 200,
        y = 200,
        dx = 8,
        dy = 2,
        WIDTH,
        HEIGHT,
        r = 12.5,
        ctx,
        upDown = false,
        downDown = false,
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
        powerbarSize = 10,
        lives;

    var brick = new Image();
    brick.src = "img/deepslate_brick.png";
    var brickBreak = new Image();
    brickBreak.src = "img/deepslate_brick_break.png";
    var knight = new Image();
    knight.src = "img/knight.png";
    var rock = new Image();
    rock.src = "img/rock.png"

    var stoneHit = new Audio('sound/Stone_hit2.ogg');
    var stoneHitBig = new Audio('sound/Stone_dig2.ogg');
    var woosh = new Audio('sound/woosh.mp3');

    var arrow = new Image();
    arrow.src = "img/arrow1.png";
    var arrowDX = -6,
        arrowX,
        arrowY,
        arrowUP = false;

    switch (difficulty) {
        case 3:
            arrowDX = -10;
            lives = 2;
            break;
        case 2:
            lives = 3;
            break;
        case 1:
            lives = 3;
            break;
        default:
            break;
    }

    function init() {
        ctx = $('#canv')[0].getContext("2d");
        WIDTH = $("#canv").width();
        HEIGHT = $("#canv").height();
        init_paddle();
        return setInterval(draw, 20);

    }

    function init_paddle() {
        paddley = HEIGHT / 2;
        paddleh = 121;
        paddlew = 81;
    }

    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    function draw() {
        clear();
        if (countToFinish <= 0) {
            win();
        }
        powerupDestroy();

        drawPaddle();

        //riši opeke
        drawBricks();

        //unicevanje opek
        destroyBricks();
        //premik puscice
        arrowMove();

        arrowHit();

        //odboj zogice
        ballBounce();
        livebar.style.width = lives * 30 + 'px';
        x += dx;
        y += dy;
    }

    function destroyBricks() {
        beforerow = row;
        rowheight = BRICKHEIGHT; //Smo zadeli opeko?
        colwidth = BRICKWIDTH;
        if (!powerupActive) {
            row = Math.floor((y + dy * 4.7) / rowheight);
            col = Math.floor(((WIDTH - x) - dx * 1.6) / colwidth);
        } else {
            row = Math.floor((y + dy * 7.1) / rowheight);
            col = Math.floor(((WIDTH - x) - dx * 2.3) / colwidth);
        }

        if (row < 0)
            row = 0;
        if (row > NROWS - 1)
            row = NROWS - 1;

        //Če smo zadeli opeko, vrni povratno kroglo in označi v tabeli, da opeke ni več
        if (bricks[row][col] > 0) {
            if (!powerupActive) {
                if (beforerow < row || beforerow > row) {
                    dy = -dy;
                } else {
                    dx = -dx;
                }
                arrowGen();
                stoneHit.play();
            } else
                stoneHitBig.play();

            bricks[row][col]--;
            countToFinish--;

        }
    }

    function drawPaddle() {
        if (downDown) { //paddel movment arows in omejevanje
            if ((paddley + paddleh) < HEIGHT) {
                paddley += 10;
            } else {
                paddley = HEIGHT - paddleh;
            }
        } else if (upDown) {
            if ((paddley + paddleh / 4) > 0) {
                paddley -= 10;
            } else {
                paddley = 0 - paddleh / 4;
            }
        }
        ctx.drawImage(knight, 0, paddley, paddlew, paddleh);
    }

    function drawBricks() {
        for (i = 0; i < NROWS; i++) {
            for (j = 1; j <= NCOLS; j++) {
                if (bricks[i][j - 1] == 2) {
                    ctx.drawImage(brick, (WIDTH - j * (BRICKWIDTH)), (i * (BRICKHEIGHT)), BRICKWIDTH, BRICKHEIGHT);
                } else if (bricks[i][j - 1] == 1) {
                    ctx.drawImage(brickBreak, (WIDTH - j * (BRICKWIDTH)), (i * (BRICKHEIGHT)), BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }
    }

    function ballBounce() {
        if (y + dy > HEIGHT - r || y + dy < r)
            dy = -dy;

        if (x + dx > WIDTH - r)
            dx = -dx;
        else if ((x + dx - paddlew < r || x + dx - paddlew / 2 < r) && dx < 0) { //odboj od ploscka
            if (y > (paddley + paddleh / 4) && y < paddley + paddleh) {
                dy = 6 * ((y - ((paddley + paddleh / 4) + paddleh / 3)) / paddleh);
                dx = -dx;
                powerupActive = false;
                paddelBounceCount++;
            } else if (x + dx - paddlew / 2 < r)
                if (lives > 1) {
                    lives--;
                    powerupActive = false;
                    dx = -dx;
                } else
                    end();
        }
    }

    function arrowHit() {
        if (arrowX <= paddlew / 1.5 && arrowY > paddley && arrowY < paddley + paddleh)
            if (lives > 1) {
                lives--;
                arrowUP = false;
                arrowX = WIDTH;
            } else
                end();
    }

    function arrowMove() {
        switch (difficulty) {
            case 2:
                if (arrowUP) {
                    ctx.drawImage(arrow, arrowX, arrowY, 84, 10);
                    arrowX += arrowDX;
                    if (arrowX <= paddlew / 3) {
                        arrowUP = false;
                        arrowX = WIDTH;
                    }
                }
                break;
            case 3:
                if (arrowUP) {
                    ctx.drawImage(arrow, arrowX, arrowY, 84, 10);
                    arrowX += arrowDX;
                    if (arrowX <= paddlew / 3) {
                        arrowUP = false;
                        arrowX = WIDTH;
                    }
                } else {
                    arrowUP = true;
                    arrowX = WIDTH;
                    arrowY = y;
                    woosh.play();
                }
                break;
            default:
                break;
        }
    }

    function arrowGen() {
        switch (difficulty) {
            case 2:
                if (!arrowUP) {
                    arrowUP = true;
                    arrowX = WIDTH;
                    arrowY = (row) * BRICKHEIGHT + BRICKHEIGHT / 2;
                    woosh.play();
                }
                break;
            default:
                break;
        }
    }

    function powerupDestroy() {
        if (paddelBounceCount >= 10) {
            powerup = true;
            powerbar.style.backgroundColor = '#cd3019';
            powerbar.style.width = '100%';
            powerbar.innerHTML = "Space";
        } else if (paddelBounceCount < 10) {
            powerup = false;
            powerbar.style.width = (powerbarSize * paddelBounceCount) + '%';
            powerbar.style.backgroundColor = '#d1c9b0';
            powerbar.innerHTML = "";
        }
        if (powerupActive)
            ctx.drawImage(rock, x - r * 1.5, y - r * 1.5, r * 2 * 1.5, r * 2 * 1.5);
        else
            ctx.drawImage(rock, x - r, y - r, r * 2, r * 2);
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

    function end() {
        clearInterval(inter);
        Swal.fire({
            icon: 'error',
            title: 'You lost',
            html: 'Redirecting to menu',
            showConfirmButton: false,
            timer: 5000,
        }).then((result) => {
            document.getElementById('menu').style = "display: flex";
            document.getElementById('game').style = "display: none";
            document.getElementById('bgimage2').style = "display: none";
            document.getElementById('difficulty').style = "display: flex";
        });
        swalStyle();
    }

    function swalStyle() {
        $(".swal2-modal").css('background', 'transparent');
        $(".swal2-title").css('color', 'white');
        $(".swal2-title").css('font-size', '30px');
        $(".swal2-html-container").css('color', 'white');
        $(".swal2-html-container").css('font-size', '25px');
        $(".swal2-content").css('color', 'white');
    }

    function win() {
        clearInterval(inter);
        Swal.fire({
            icon: 'success',
            title: 'You won',
            html: 'Redirecting to menu',
            showConfirmButton: false,
            timer: 5000,
        }).then((result) => {
            document.getElementById('menu').style = "display: flex";
            document.getElementById('game').style = "display: none";
            document.getElementById('bgimage2').style = "display: none";
            document.getElementById('difficulty').style = "display: flex";
        });
        swalStyle();
    }

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
        // countToFinish *=0.95;
    }

    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);

    var inter = init();
    initbricks();
}