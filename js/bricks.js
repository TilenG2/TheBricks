function drawIt() {
    var x = 200,
        y = 200,
        dx = 4,
        dy = 1,
        WIDTH,
        HEIGHT,
        r = 20,
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
        PADDING,
        row,
        col,
        beforerow,
        rowheight,
        colwidth,
        countToFinish = 0,
        paddelBounceCount = 0,
        powerup = false;

    var brick = new Image();
    brick.src = "img/deepslate_brick.png";
    var brickBreak = new Image();
    brickBreak.src = "img/deepslate_brick_break.png";
    var knight = new Image();
    knight.src = "img/knight.png";

    function init() {
        ctx = $('#canv')[0].getContext("2d");
        WIDTH = $("#canv").width();
        HEIGHT = $("#canv").height();
        init_paddle();
        return setInterval(draw, 10);

    }

    function init_paddle() {
        paddley = HEIGHT / 2;
        paddleh = 150;
        paddlew = 100;
    }

    function circle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
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
        if (paddelBounceCount % 10 == 0)
            powerup = true;
        else
            powerup = false;
        circle(x, y, r); // Zogica

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
                    // rect((WIDTH - j * (BRICKWIDTH + PADDING)) + PADDING,
                    //     (i * (BRICKHEIGHT + PADDING)) + PADDING,
                    //     BRICKWIDTH, BRICKHEIGHT);
                    ctx.drawImage(brick, (WIDTH - j * (BRICKWIDTH + PADDING)) + PADDING, (i * (BRICKHEIGHT + PADDING)) + PADDING, BRICKWIDTH, BRICKHEIGHT);
                } else if (bricks[i][j - 1] == 1) {
                    ctx.drawImage(brickBreak, (WIDTH - j * (BRICKWIDTH + PADDING)) + PADDING, (i * (BRICKHEIGHT + PADDING)) + PADDING, BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }

        //unicevanje opek
        beforerow = row;
        rowheight = BRICKHEIGHT + PADDING; //Smo zadeli opeko?
        colwidth = BRICKWIDTH + PADDING;
        row = Math.floor((y + dy * 15) / rowheight);
        col = Math.floor(((WIDTH - x) - dx * 5) / colwidth);

        // if (col < 0) col = 0;
        // if (col > NCOLS) col = NCOLS - 1;
        if (row < 0) row = 0;
        if (row > NROWS - 1) row = NROWS - 1;

        //Če smo zadeli opeko, vrni povratno kroglo in označi v tabeli, da opeke ni več
        if (bricks[row][col] > 0) {
            if (!powerup)
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
                dy = 6 * ((y - ((paddley + paddleh / 4) + paddleh / 2)) / paddleh);
                dx = -dx;
                paddelBounceCount++;
            } else
                clearInterval(inter);
        }
        x += dx;
        y += dy;
    }

    function onKeyDown(evt) {
        if (evt.keyCode == 38)
            upDown = true;
        else if (evt.keyCode == 40)
            downDown = true;
    }

    function onKeyUp(evt) {
        if (evt.keyCode == 38)
            upDown = false;
        else if (evt.keyCode == 40)
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
        BRICKWIDTH = 128;
        BRICKHEIGHT = (HEIGHT / NROWS) - 1;
        PADDING = 1;
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