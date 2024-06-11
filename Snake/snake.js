//JavaScript for Snake//
//Snake v.1.0.0//

//Random number//
function randInt(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min);
}

//Playboard//
let gameLoopInterval,
    gamemode = 0,
    tileSize = 15,
    xTiles = 50,
    yTiles = 30,
    canvas = document.getElementById("PlayingBoard"),
    ctx = canvas.getContext("2d"),
    time = 0,
    speed = 0,
    timeFactor = 1,
    speedMultiplier = 0.95,
    gameOngoing = true;

function clearPlayboard() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
}

ctx.canvas.width = xTiles * tileSize;
ctx.canvas.height = yTiles * tileSize;

const Direction = {
    UP: "up",
    DOWN: "down",
    RIGHT: "right",
    LEFT: "left"
};

function drawText(text,font,color,x,y) {
    ctx.beginPath();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text,x,y);
    ctx.closePath();
}

function keyboardInput(event) {
    if (event.key == "W" || event.key == "w"){
        snakeDirection = Direction.UP;
        snakeDirection1 = Direction.UP;
    }
    else if (event.key == "S" || event.key == "s") {
        snakeDirection = Direction.DOWN;
        snakeDirection1 = Direction.DOWN;
    }
    else if (event.key == "A" || event.key == "a") {
        snakeDirection = Direction.LEFT;
        snakeDirection1 = Direction.LEFT;
    }
    else if (event.key == "D" || event.key == "d") {
        snakeDirection = Direction.RIGHT;
        snakeDirection1 = Direction.RIGHT;
    }
    if (event.key == "ArrowUp"){
        snakeDirection = Direction.UP;
        snakeDirection2 = Direction.UP;
    }
    else if (event.key == "ArrowDown") {
        snakeDirection = Direction.DOWN;
        snakeDirection2 = Direction.DOWN;
    }
    else if (event.key == "ArrowLeft") {
        snakeDirection = Direction.LEFT;
        snakeDirection2 = Direction.LEFT;
    }
    else if (event.key == "ArrowRight") {
        snakeDirection = Direction.RIGHT;
        snakeDirection2 = Direction.RIGHT;
    }
}

//General Class//
    class object {
        constructor(x,y,color,timer) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.timer = timer
        }
        show() {
            ctx.beginPath();
            ctx.rect(this.x*tileSize, this.y*tileSize, tileSize, tileSize);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }
    
//Snake Class//
class snakes extends object {
    constructor(x,y,color,timer) {
        super(x,y,color,timer);
        this.direction = snakeDirection
    }
    move() {
        if (this.direction == Direction.UP) {
            this.y--;
        }
        else if (this.direction == Direction.DOWN) {
            this.y++;
        }
        else if (this.direction == Direction.RIGHT) {
            this.x++;
        }
        else if (this.direction == Direction.LEFT) {
            this.x--;
         };
    }
    update() {
        if (this == Player1) {
            this.direction = snakeDirection1 
        }

        else if (this == Player2) {
            this.direction = snakeDirection2
        }

        else {
            this.direction = snakeDirection
            }
    }
}



//Snake Movement Property//
snakeDirection = Direction.RIGHT;

//Food Class//
class food extends object {
    constructor(x,y,color,timer) {
        super(x,y,color,timer)
    }
    generate() {
        this.x = randInt(0, xTiles - 1);
        this.y = randInt(0, yTiles - 1); 
        this.timer = 15 
    }
    collision() {
        if (gamemode == 1) {
            if (SinglePlayer.x == this.x && SinglePlayer.y == this.y) {
                SinglePlayer.score++;
                speed = speed * speedMultiplier
                timeFactor = timeFactor * speedMultiplier
                clearInterval(gameLoopInterval)
                gameLoopInterval = setInterval(gameLoop, speed);
                this.generate();
            };
        }
        else if (gamemode == 2) {
            if (Player1.x == this.x && Player1.y == this.y) {
                Player1.score++;
                this.generate();
            }            
            else if (Player2.x == this.x && Player2.y == this.y) {
                Player2.score++;
                this.generate();
            };
        };
    }
    checkTimer() {
        if (this.timer <= 0) {
            this.generate()
        }
        else {
            this.timer -= 0.1 * timeFactor
        }
    }
}

function PlayerHit() {
    if(Player1.x == Player2.x && Player1.y == Player2.y) {
        gameOngoing = false
        clearInterval(gameLoopInterval);
    };
}

function checkGameStatus() {
    if (gameOngoing) {
        time += 0.1 * timeFactor * speedMultiplier;
    }
    else {
        clearPlayboard();
        drawText("Game Over","100px Rockwell","black", 100, 250);
        if (gamemode == 1) {
            //Score + Time//
            drawText("Score: " + SinglePlayer.score,2*tileSize + "px Rockwell","black", 10, canvas.height - 10);
            drawText("Time: " + round(time,'e+1','e-1'),2*tileSize + "px Rockwell","black", canvas.width - 140, canvas.height - 10);
        }

        if  (gamemode == 2) {
            //Score + Time//
            drawText("Score: " + Player1.score,2*tileSize + "px Rockwell","red", 10, canvas.height - 10);
            drawText("Score: " + Player2.score,2*tileSize + "px Rockwell","blue", canvas.width - 140, canvas.height - 10);
        }
    }
}

function round(num,pen,nen) {
    return +(Math.round(num + pen) + nen);
}

//Snake Head extension//
class snakehead extends snakes {
    constructor(x,y,color,direction) {
        super(x,y,color,direction,"");
        this.score = 0
    }
    wallHit() {
        if (this.x >= xTiles || this.x < 0 || this.y >= yTiles || this.y < 0) {
            clearInterval(gameLoopInterval);
            gameOngoing = false
        }
    }
}

//Loop//
function gameLoop() {
    //Clear Playboard//
    clearPlayboard()
    if (gamemode == 1) {
        //Score + Time//
        drawText("Score: " + SinglePlayer.score,2*tileSize + "px Rockwell","black", 10, canvas.height - 10);
        drawText("Time: " + round(time,'e+1','e-1')
        ,2*tileSize + "px Rockwell","black", canvas.width - 140, canvas.height - 10);
        //Moving Snake//
        SinglePlayer.update();
        SinglePlayer.move();
        //Check if GameOver//
        SinglePlayer.wallHit();
        //Snake drawing//
        SinglePlayer.show();
    }

    if  (gamemode == 2) {
        //Score + Time//
        drawText("Score: " + Player1.score,2*tileSize + "px Rockwell","red", 10, canvas.height - 10);
        drawText("Score: " + Player2.score,2*tileSize + "px Rockwell","blue", canvas.width - 140, canvas.height - 10);
        //Moving Snake//
        Player1.update();
        Player1.move();
        Player2.update();
        Player2.move();
        //Check if GameOver//
        Player1.wallHit();
        Player2.wallHit();
        PlayerHit();
        //Snake drawing//
        Player1.show();
        Player2.show();
    }

    //Check if food got eaten//
    food1.collision();
    food2.collision();
    food3.collision();
    food1.checkTimer();
    food2.checkTimer();
    food3.checkTimer();
    checkGameStatus();
    //FoodDrawing//
    food1.show();
    food2.show();
    food3.show();
}

let SinglePlayer = new snakehead(2,2,"red", Direction.RIGHT),
Player1 = new snakehead(2,2,"red", Direction.RIGHT),
Player2 = new snakehead(47,27,"blue", Direction.LEFT);

let food1 = new food("","","green",0),
food2 = new food(-1,-1,"green",10),
food3 = new food(-1,-1,"green",30);

function Singleplayer() {
    gamemode = 1;
}

function Multiplayer() {
    gamemode = 2;
}

function easy() {
    speed = 110;
    timeFactor = 1.1;
    SinglePlayer.score = 0;
    Player1.score = 0;
    Player2.score = 0;
}

function medium() {
    speed = 90;
    timeFactor = 0.9;
    SinglePlayer.score = 0;
    Player1.score = 0;
    Player2.score = 0;
}

function hard() {
    speed = 75;
    timeFactor = 0.75;
    SinglePlayer.score = 0;
    Player1.score = 0;
    Player2.score = 0;
}

function Execute() {
   if (gamemode != 0 && speed != 0) {   
        snakeDirection = Direction.RIGHT;
        snakeDirection1 = Direction.RIGHT;
        snakeDirection2 = Direction.LEFT;
        speed = speed / (speedMultiplier**(SinglePlayer.score+Player1.score+Player2.score));
        SinglePlayer.x = 2;
        SinglePlayer.y = 2;
        Player1.x = 2;
        Player1.y = 2;
        Player2.x = xTiles - 3;
        Player2.y = yTiles - 3;
        SinglePlayer.score = 0;
        Player1.score = 0;
        Player2.score = 0;
        time = 0;
        food1.x = "";
        food1.y = "";
        food2.x = -1;
        food2.y = -1;
        food3.x = -1;
        food3.y = -1;
        food2.timer = 10;
        food3.timer = 30;
        gameOngoing = true;
        Start.innerText = "Restart";
        food1.generate();
        document.addEventListener("keydown", keyboardInput);
        gameLoopInterval = setInterval(gameLoop, speed);
   }
   else {
    drawText("Choose gamemode and difficulty before the start",2*tileSize + "px Rockwell","black", 10, canvas.height - 10)
   }
}

//Executed Programm Part//
document.getElementById("Start").onclick = function() {Execute()};
document.getElementById("Singleplayer").onclick = function() {Singleplayer()};
document.getElementById("Multiplayer").onclick = function() {Multiplayer()};
document.getElementById("Easy").onclick = function() {easy()};
document.getElementById("Medium").onclick = function() {medium()};
document.getElementById("Hard").onclick = function() {hard()};