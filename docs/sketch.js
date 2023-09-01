/*

My Game - Stage

*/

/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var collectables;
var canyons;

var flagpole;
var lives;

var enemies;

var platforms;

var game_score;

var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
    

    lives = 5;
    textSize(20);
    
    startGame();
    
}

function startGame()
{
    floorPos_y = height * 3/4;
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    
	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
    clouds = [{x_pos: 150, y_pos: 115},
              {x_pos: 450, y_pos: 115},
              {x_pos: 750, y_pos: 115},
              {x_pos: 1250, y_pos: 115},
              {x_pos: 1450, y_pos: 115},
              {x_pos: 1850, y_pos: 115},
              {x_pos: 2050, y_pos: 115},
              {x_pos: 2350, y_pos: 115},
              {x_pos: 2650, y_pos: 115},
              {x_pos: 2850, y_pos: 115},
              {x_pos: 3050, y_pos: 115},
              {x_pos: 3350, y_pos: 115}
             ];
    
    mountains = [{x_pos: -80, y_pos: 432},
                {x_pos: 300, y_pos: 432},
                {x_pos: 800, y_pos: 432},
                {x_pos: 950, y_pos: 432},
                {x_pos: 1250, y_pos: 432},
                {x_pos: 1400, y_pos: 432},
                {x_pos: 1800, y_pos: 432},
                {x_pos: 1900, y_pos: 432},
                {x_pos: 2450, y_pos: 432},
                {x_pos: 2900, y_pos: 432}
                ];
    
    trees_x = [
        50, 250, 500, 
        1000, 1200, 1300, 
        1500, 1770, 2100, 
        2270, 2600, 2900, 
        3200, -500
    ];
    
    collectables = [{x_pos: 50, y_pos: floorPos_y, size: 40, isFound: false},
                   {x_pos: 300, y_pos: floorPos_y, size: 40, isFound: false},
                   {x_pos: 560, y_pos: floorPos_y, size: 40, isFound: false},
                   {x_pos: 800, y_pos: floorPos_y, size: 40, isFound: false},
                   {x_pos: 1000, y_pos: floorPos_y, size: 40, isFound: false},
                   {x_pos: 1250, y_pos: floorPos_y, size: 40, isFound: false},
                   {x_pos: 1500, y_pos: floorPos_y, size: 40, isFound: false},
                   {x_pos: 1800, y_pos: floorPos_y, size: 40, isFound: false},
                   {x_pos: 2100, y_pos: floorPos_y, size: 40, isFound: false},
                   {x_pos: 2300, y_pos: floorPos_y, size: 40, isFound: false},
                   {x_pos: 2600, y_pos: floorPos_y, size: 40, isFound: false}
    ];
    
    canyons = [{x_pos: 130, width: 100},
              {x_pos: 600, width: 100},
              {x_pos: 1600, width: 100},
              {x_pos: 2350, width: 100},
              {x_pos: 2700, width: 100},
              {x_pos: 3300, width: 100},
    ];
    
    platforms = [];
    
    platforms.push(createPlatforms(200, floorPos_y -80, 200));
    platforms.push(createPlatforms(600, floorPos_y -80, 100));
    platforms.push(createPlatforms(1500, floorPos_y -80, 100));
    platforms.push(createPlatforms(2400, floorPos_y -80, 100));
    platforms.push(createPlatforms(3250, floorPos_y -80, 200));
    
    game_score = 0;
    
    flagpole = {x_pos: 3500, isReached: false, height: 300};
    
    lives -= 1;
    
    enemies = [];
    enemies.push(new Enemy(100, floorPos_y - 10, 100));
    enemies.push(new Enemy(800, floorPos_y - 10, 100));
    enemies.push(new Enemy(1500, floorPos_y - 10, 100));
    enemies.push(new Enemy(2200, floorPos_y - 10, 100));
    enemies.push(new Enemy(2900, floorPos_y - 10, 100));
}


function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

    push();
    translate(scrollPos, 0);
	drawClouds();
    drawMountains();
    drawTrees();
    
    for(var i = 0; i < platforms.length; i ++)
        {
            platforms[i].draw();
        }
    
    // Draw collectable items.
    for(var i = 0; i < collectables.length; i++)
        {
            if(!collectables[i].isFound)
            {
                drawCollectable(collectables[i]);
                checkCollectable(collectables[i]);                
            }
        }
    
	// Draw canyons.
    for(var i = 0; i < canyons.length; i++)
    {

        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
	
    if(!checkFlagpole.isReached)
    {
        checkFlagpole(flagpole);
    }
    
    // Draw flagpole
    renderFlagpole(flagpole);
    
    for(var i = 0; i < enemies.length; i++)
        {
            enemies[i].draw();
            
            var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
            
            if(isContact)
                {
                    if(lives > 0)
                        {
                            startGame();
                            break;
                        }
                }
        }
    
    pop();
	
    // Draw game character.
	
	drawGameChar();
    
//    fill(255);
//    noStroke();
    text("score: " + game_score, 20, 20);
    text("lives: " + lives, 20, 40);
        
    //game over
//    for(var i = lives; i >=0; i--)
//    {
//        text("lives: " + lives, 20, 40);
//        hearts(880 + i * 60, 40);
//    }
    
    if(lives <= 0)
    {
//        push();
//        fill(0);
//        textSize(20);
        text("Game over. Press refresh (F5) to continue.", width/3, height/2);
        return;
//        pop();
    }
    //level complete
    else if(flagpole.isReached)
    {
//        push();
//        fill(0);
//        textSize(20);
        text("Level complete. Press space to continue.", width/3, height/2);
//        pop();
        return;
    }
    
    if(gameChar_y > height)
    {
        if(lives > 0 )startGame();
    }
    
    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
            gameChar_x += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
            {
                if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
                    {
                        isContact = true;
                        break;
                    }
            }
        if(isContact == false)
            {
                gameChar_y += 2;
                isFalling = true;
            }
    }
    else
    {
        isFalling = false;
    }
    
    if(isPlummeting)
    {
        gameChar_y += 5;
    }
    
//    if(flagpole.isReached == false)
//    {
//        checkFlagpole();
//    }
    

//    checkPlayerDie();
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    

}



// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
	if(flagpole.isReached && key == ' ')
    {
        startGame();
//        nextLevel();
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
    }
    
    if(key == "A" || keyCode == 37)
        {
            isLeft = true;
        }
    
    if(key == "D" || keyCode == 39)
        {
            isRight = true;
        }
    
    if(key == ' ' || key == "W")
        {
            if(!isFalling)
            {
                gameChar_y -= 100;
                jumpSound.play();
            }
        }
}

function keyReleased(){

	if(key == "A" || keyCode == 37)
        {
            isLeft = false;
        }
    if(key == "D" || keyCode == 39)
        {
            isRight = false;
        }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        fill(0);
        rect(gameChar_x - 12, gameChar_y - 10, 15, 10);
        fill(255, 0, 0);
        rect(gameChar_x - 10, gameChar_y - 55, 20, 50);
        fill(255, 150, 150);
        ellipse(gameChar_x, gameChar_y - 55, 25, 40);
        fill(35);
        rect(gameChar_x, gameChar_y - 10, 15, 10);
	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(0);
        rect(gameChar_x - 12, gameChar_y - 10, 15, 10);
        fill(255, 0, 0);
        rect(gameChar_x - 10, gameChar_y - 55, 20, 50);
        fill(255, 150, 150);
        ellipse(gameChar_x, gameChar_y - 55, 25, 40);
        fill(35);
        rect(gameChar_x, gameChar_y - 10, 15, 10);
	}
	else if(isLeft)
	{
		// add your walking left code
        fill(0);
        rect(gameChar_x - 12, gameChar_y - 10, 15, 10);
        fill(255, 0, 0);
        rect(gameChar_x - 10, gameChar_y - 55, 20, 50);
        fill(255, 150, 150);
        ellipse(gameChar_x, gameChar_y - 55, 25, 40);
        fill(35);
        rect(gameChar_x, gameChar_y - 10, 15, 10);

	}
	else if(isRight)
	{
		// add your walking right code
        fill(0);
        rect(gameChar_x - 12, gameChar_y - 10, 15, 10);
        fill(255, 0, 0);
        rect(gameChar_x - 10, gameChar_y - 55, 20, 50);
        fill(255, 150, 150);
        ellipse(gameChar_x, gameChar_y - 55, 25, 40);
        fill(35);
        rect(gameChar_x, gameChar_y - 10, 15, 10);
	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        fill(255, 0, 0);
        rect(gameChar_x - 15, gameChar_y - 55, 30, 50);
        fill(255, 150, 150);
        ellipse(gameChar_x, gameChar_y - 55, 40, 40);
        fill(0);
        rect(gameChar_x - 16, gameChar_y - 10, 10, 10);
        rect(gameChar_x + 6, gameChar_y - 10, 10, 10);
	}
	else
	{
		// add your standing front facing code
        fill(255, 0, 0);
        rect(gameChar_x - 15, gameChar_y - 55, 30, 50);
        fill(255, 150, 150);
        ellipse(gameChar_x, gameChar_y - 55, 40, 40);
        fill(0);
        rect(gameChar_x - 16, gameChar_y - 10, 10, 10);
        rect(gameChar_x + 6, gameChar_y - 10, 10, 10);
        
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
        fill(255);
        ellipse(clouds[i].x_pos, 
                clouds[i].y_pos, 
                90, 
                50);
        ellipse(clouds[i].x_pos + 100, 
                clouds[i].y_pos, 
                90, 
                50);
        ellipse(clouds[i].x_pos + 50, 
                clouds[i].y_pos, 
                90, 
                50);
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
        fill(125, 125, 125);
        triangle(mountains[i].x_pos, 
                 mountains[i].y_pos, 
                 mountains[i].x_pos + 100, 
                 mountains[i].y_pos - 200, 
                 mountains[i].x_pos + 200, 
                 mountains[i].y_pos);
    }
}
    
// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        fill(120, 80, 40);
        rect(trees_x[i],-200/2 + floorPos_y, 60, 200/2);

        //branches
        fill(0, 155, 0);
        //triangle(850, 332, 930, 232, 1010, 332);
        triangle(trees_x[i] - 50,-200/2 + floorPos_y, 
                 trees_x[i] + 30,-200 + floorPos_y, 
                 trees_x[i] + 110,-200/2 + floorPos_y);
        //triangle(850, 282, 930, 182, 1010, 282);
        triangle(trees_x[i] - 50,-200/4 + floorPos_y, 
                 trees_x[i] + 30,-200*3/4 + floorPos_y, 
                 trees_x[i] + 110,-200/4 + floorPos_y);
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(184, 134, 11);
    ellipse(t_collectable.x_pos, 
            t_collectable.y_pos - 20, 
            t_collectable.size, 
            t_collectable.size);
    fill(255, 215, 0);
    ellipse(t_collectable.x_pos, 
            t_collectable.y_pos - 20, 
            t_collectable.size - 25, 
            t_collectable.size - 25);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < t_collectable.size)
        {
            t_collectable.isFound = true;
            game_score += 1;
        }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
//    noStroke();
    fill(100, 155, 255);
    rect(t_canyon.x_pos, 
             floorPos_y, 
             t_canyon.width, 
             height - floorPos_y);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y)
            {
               isPlummeting = true;
            }
}

function renderFlagpole(t_flagpole)
{
    push();
    strokeWeight(5);
    stroke(180);
    line(t_flagpole.x_pos, floorPos_y, t_flagpole.x_pos, floorPos_y - flagpole.height);
    pop();
    
//    fill(255, 0, 255);
//    noStroke();
    
    
    if(t_flagpole.isReached)
    {
        fill(255, 0, 255);
        rect(t_flagpole.x_pos, floorPos_y - flagpole.height, 80, 50);
    }
//    else
//    {
//        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
//    }
        
    
}

function checkFlagpole(t_flagpole)
{
//    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(dist(gameChar_world_x, 0, flagpole.x_pos, 0) < 20)
    {
        t_flagpole.isReached = true;
    }
    
}

function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(255, 0, 255);
            rect(this.x, this.y, this.length, 20);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                    {
                        return true;
                    }
            }
            return false;
        }
    }
    return p;
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
            {
                this.inc = -1;
            }
        else if(this.currentX < this.x)
            {
                this.inc = 1;
            }
    }
    
    this.draw = function()
    {
        this.update();
        fill(255, 0, 0)
        ellipse(this.currentX, this.y, 20, 20);
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y)
        console.log(d);
        if(d < 20)
            {
                return true;
            }
        return false;
    }
    
}



//function hearts(x, y)
//{
//    fill(255, 0, 0);
//    beginShape()
//    vertex(x , y);
//    vertex(x - 15, y - 15);
//    vertex(x + 15, y - 15);
//    endShape();
//    ellipse(x - 7.5, y - 22.5, 21, 21);
//    ellipse(x + 7.5, y - 22.5 ,21, 21)
//    
//}
