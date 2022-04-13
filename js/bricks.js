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
    document.getElementById('difficulty').style = "display: block";
    document.getElementById('credits').style = "display: none";
    document.getElementById('rules').style = "display: none";
    document.getElementById('menu').style = "display: flex";
}
var difficulty = 1;

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
    var powerbar = document.getElementById('powerbar');
    var livebar = document.getElementById('health');
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
        powerbarSize = 10,
        lives;

    var brick = new Image();
    brick.src = "img/deepslate_brick.png";
    var brickBreak = new Image();
    brickBreak.src = "img/deepslate_brick_break.png";
    var knight = new Image();
    knight.src = "img/knight.png";

    var stoneHit = new Audio('sound/Stone_hit2.ogg');

    var arrow = new Image();
    arrow.src = "img/arrow1.png";
    var arrowDX = -3,
        arrowX,
        arrowY,
        arrowUP = false;

    switch (difficulty) {
        case 3:
            arrowDX = -5;
            lives = 2;
            break;
        case 2:
            lives = 2;
            break;
        case 1:
            lives = 3;
            break;
        default:
            break;
    }

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
        paddleh = 121;
        paddlew = 81;
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
            console.log("finish");
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
            if (!powerupActive) {
                if (beforerow < row || beforerow > row) {
                    dy = -dy;
                } else {
                    dx = -dx;
                }
                switch (difficulty) {
                    case 2:
                        if (!arrowUP) {
                            arrowUP = true;
                            arrowX = WIDTH;
                            arrowY = (row) * BRICKHEIGHT + BRICKHEIGHT / 2;
                        }
                        break;
                    default:
                        break;
                }

            }
            stoneHit.play();
            bricks[row][col]--;
            countToFinish--;

        }
        //premik puscice
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
                }
                break;
            default:
                break;
        }

        if (arrowX <= paddlew / 1.5 && arrowY > paddley && arrowY < paddley + paddleh)
            if (lives > 1) {
                lives--;
                arrowUP = false;
                arrowX = WIDTH;
            } else
                end();

            //odboj zogice
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
                    dx = -dx;
                } else
                    end();
        }
        livebar.style.height = lives * 20 + 'px';
        x += dx;
        y += dy;
    }

    function powerupDestroy() {
        if (paddelBounceCount >= 10) {
            powerup = true;
            powerbar.style.backgroundColor = '#FFF800';
            powerbar.style.width = '100%';
            powerbar.innerHTML = "Space";
        } else if (paddelBounceCount < 10) {
            powerup = false;
            powerbar.style.width = (powerbarSize * paddelBounceCount) + '%';
            powerbar.style.backgroundColor = '#24FF00';
            powerbar.innerHTML = "";
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

    function end() {
        clearInterval(inter);
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

    var inter = init();
    // init_mouse();
    initbricks();
}