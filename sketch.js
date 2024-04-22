// Tank Variables
let p1, p1Cannon, redTank, redCannon
let p2, p2Cannon, blueTank, blueCannon
let p1HP = 100
let p2HP = 100
let p1CannonAngle = 0
let p2CannonAngle = 0

// Game screen variable
let screen = 0;
// Keep track of turns
let currentPlayer = 'p1'

// Projectile Variables
let p1Proj, p2Proj
let projVelocity = 4 // Speed of projectile
let projPwr = 100 // Energy of projectile
let projFallSpeed = projVelocity // Speed of decent
let projMaxHeight = 500 // Maximum height a projectile can be

// Map Array
let mapObjs = []

// Assets
let menuImg, logo, fireGif, fire, play, tankShell
let cannonMove, cannonFire, cannonHit, menuMusic

// Video
let video
let playing = true

// JSON
let highScores

// Input
let textBox
let userName


function preload() {
	// Load menu images
	menuImg = loadImage('images/menu-screen.png')
	logo = loadImage('images/logo.png')
	fireGif = loadImage('images/fire.gif')
	play = loadImage('images/play.png')
	map1Img = loadImage('images/world1-1.png')
	map2Img = loadImage('images/greenhillzone.png')
	map3Img = loadImage('images/hyrule.png')

	// Load Sprites
	redTank = loadImage('images/redtank(1).gif')
	blueTank = loadImage('images/bluetank(1).gif')
	redCannon = loadImage('images/redcannon(1).png')
	blueCannon = loadImage('images/bluecannon(1).png')
	tankShell = loadImage('images/tankshell.png')

	// Load sounds
	soundFormats('mp3');
	cannonMove = loadSound('sounds/cannonmove.mp3')
	cannonFire = loadSound('sounds/firesound.mp3')
	cannonHit = loadSound('sounds/hitsound.mp3')
	menuMusic = loadSound('sounds/menumusic.mp3')

	// Load JSON
	highScores = loadJSON('highscoredata.json')
}

function setup() {
	new Canvas(750, 750);

	// menuMusic.play()
	// menuMusic.volume(0.2)
	// menuMusic.loop()

	// Load Video
	video = createVideo('images/howtoplay.webm')
	video.size(200, 200)
	video.volume(0)
	video.loop()
	video.hide()

	// Json Data
	let p1Score = highScores.highscores.P1
	let p2Score = highScores.highscores.P2
	console.log(p1Score)
	console.log(p2Score)

	// Text Input
	textBox = createInput('')
	textBox.position(-100, -100)
	textBox.size(100)
	

	// Tank Body
	p1 = new Sprite()
	p1.static = true;
	p1.img = redTank
	p1.x = -100
	p1.y = -100

	// Tank Cannon
	p1Cannon = new Sprite()
	p1Cannon.static = true;
	p1Cannon.img = redCannon
	p1Cannon.x = p1.x
	p1Cannon.y = p1.y - p1.height / 2

	// Tank Body
	p2 = new Sprite()
	p2.static = true;
	p2.img = blueTank
	p2.x = -100
	p2.y = -100

	// Tank Cannon
	p2Cannon = new Sprite()
	p2Cannon.static = true;
	p2Cannon.img = blueCannon
	p2Cannon.x = p2.x
	p2Cannon.y = p2.y - p2.height / 2
}

function draw() {

	// Check for switching screens
	if(screen == 0) {
		startScreen()
	} else if (screen == 1) {
		menuScreen()
	} else if (screen == 2) {
		gameScreen1()
	} else if (screen == 3) {
		gameScreen2()
	} else if (screen == 4) {
		gameScreen3()
	} else if (screen == 5) {
		scoreScreen()
	}

	detectCollisions();
}

function startScreen() {
	// Starting Screen Code

	background(menuImg)
	textSize(50)
	textFont('Pixelify Sans')
	image(logo, 200, 50)
	let playbtn = text('Play', 330, 200)

	// Fire Sprite
	if(!fire) {
		fire = new Sprite()
		fire.img = fireGif
		fire.w = 25
		fire.h = 50
		fire.x = 375
		fire.y = 600
		fire.static = true;
	}

	// If mouse if over play change green, when clicked switch to next screen
	if (mouseX > 330 && mouseX < 430 && mouseY > 150 && mouseY < 220) {
		playbtn.fill('green')
		cursor('pointer')
		if(mouseIsPressed) {
			fire.static = false;
			world.gravity.y = 10
			screen = 1
		}
	} else {
		playbtn.fill('black')
		cursor(ARROW)
	}

}

function menuScreen() {
	background(menuImg);
    cursor(ARROW);
    textAlign(CENTER);
    fill('Black');
    text('Choose Map', width / 2, height / 8);
    textSize(30);

	// Arrays for map images
    let mapImages = [map1Img, map2Img, map3Img];
	let mapNames = ['1st World', 'Greenest Hill', 'Dierule']
    let mapXPositions = [100, 300, 500];

	// Loop for generating images and names
    for (let i = 0; i < mapImages.length; i++) {
        let mapX = mapXPositions[i];
        image(mapImages[i], mapX, height / 3);
		fill('white')
		text(mapNames[i], mapX + 75, height / 1.75);

        if (mouseX > mapX && mouseX < mapX + 150 && mouseY > 250 && mouseY < 400) {
            cursor('pointer');
            if (mouseIsPressed) {
                screen = i + 2;
            }
        }

    }

	// Display Video
	text('How To Play', width / 2, height / 2 + 120)
	let vid = video.get()
	image(vid, width / 2 - 100, height / 2 + 150)

	// Text Input for player name
	text('What Is Your Name?', width / 2, 160)
	textBox.position(width / 2 - 55, 175)
	userName = textBox.value()
	text(userName, width / 2, 230)
}

function gameScreen1() {
	cursor(ARROW)
	background('skyblue')

	textBox.position(-100, -100)
	noStroke()

	fill('brown')
	// Insert map objects into array
	mapObjs[0] = rect(0, 675, 750, 100) // Floor
	mapObjs[1] = rect(100, 500, 50, 50) // Small Platform
	mapObjs[2] = rect(250, 500, 300, 50) // Large Platform
	fill('green')
	mapObjs[3] = rect(700, 600, 50, 100) // Right Column

	// Place p1 tank
	p1.x = 100
	p1.y = 667
	p1Cannon.x = p1.x
	p1Cannon.y = p1.y - p1.height / 6 + 1

	// Place p2 tank
	p2.x = 520
	p2.y = 490
	p2Cannon.x = p2.x
	p2Cannon.y = p2.y - p2.height / 6 + 1

	// Control functions for tank cannons
	p1AimCannon()
	p2AimCannon()
	
	// Display numerical values for the player
	displayValues()

	// Check for health points and change screen if necessary
    if (p1HP <= 0 || p2HP <= 0) {
        screen = 5;
    }
}

function gameScreen2() {
	cursor(ARROW)
	background('dodgerblue')
	
	textBox.position(-100, -100)
	noStroke()

	fill('green')
	// Insert map objects into array
	mapObjs[0] = rect(0, 675, 750, 100) // Floor
	mapObjs[1] = rect(125, 200, 500, 500, 10, 10) // Large Rectangle
	fill('dodgerblue')
	mapObjs[2] = ellipse(width / 2, 450, 400, 400) // Middle circle

	// Place p1 tank
	p1.x = 40
	p1.y = 670
	p1Cannon.x = p1.x
	p1Cannon.y = p1.y - p1.height / 6 + 1

	// Place p2 tank
	p2.x = 710
	p2.y = 670
	p2Cannon.x = p2.x
	p2Cannon.y = p2.y - p2.height / 6 + 1

	// Control functions for tank cannons
	p1AimCannon()
	p2AimCannon()

	// Display numerical values for the player
	displayValues()

	// Check for health points and change screen if necessary
    if (p1HP <= 0 || p2HP <= 0) {
        screen = 5;
    }
}

function gameScreen3() {
	cursor(ARROW)
	background('yellow')
	
	textBox.position(-100, -100)
	noStroke()

	fill('green')
	// Insert map objects into array
	mapObjs[0] = rect(0, 600, 750, 200) // Floor
	mapObjs[1] = rect(700, 500, 50, 100) // Right Column
	mapObjs[2] = rect(0, 500, 50, 100) // Left Column
	mapObjs[4] = rect(450, 100, 400, 200) // Right large square
	mapObjs[5] = rect(0, 100, 100, 200) // Right Column
	mapObjs[6] = rect(100, 100, 100, 100) // Right Square

	// Place p1 tank
	p1.x = 90
	p1.y = 590
	p1Cannon.x = p1.x
	p1Cannon.y = p1.y - p1.height / 6 + 1

	// Place p2 tank
	p2.x = 655
	p2.y = 590
	p2Cannon.x = p2.x
	p2Cannon.y = p2.y - p2.height / 6 + 1

	// Control functions for tank cannons
	p1AimCannon()
	p2AimCannon()

	// Display numerical values for the player
	displayValues()

	// Check for health points and change screen if necessary
    if (p1HP <= 0 || p2HP <= 0) {
        screen = 5;
    }
}

function scoreScreen() {
	clear()

	textBox.position(-100, -100)

	background('black')
	textSize(50)
	fill('red')
	text(p1HP, width / 2 - 200, height / 2)
	fill('blue')
	text(p2HP, width / 2 + 200, height / 2)

	// Display which player has the most points as the winner
	if(p1HP > p2HP) {
		fill('red')
		text('Player 1 Wins!', width / 2, height / 2 -200)
	} else {
		fill('blue')
		text('Player 2 Wins!', width / 2, height / 2 -200)
	}

	fill('White')
	text('Click to Return To Menu', width / 2, height / 2 + 200)

	// Hide Tanks
	p1.x = -100
	p1.x = -100
	p1Cannon.x = p1.x
	p1Cannon.y = p1.y

	p2.x = -100
	p2.x = -100
	p2Cannon.x = p2.x
	p2Cannon.y = p2.y

	// Insert new scores into JSON file and return to menu screen
	if(mouseIsPressed) {
		let p1health = highScores.highscores.P1 = p1HP
		let p2health = highScores.highscores.P2 = p2HP
		saveJSON(highScores, 'highscoredata.json')
		p1HP = 100
		p2HP = 100
		screen = 1
	}
}

// Function for displaying numerical game values
function displayValues() {
	textSize(15)
	fill('black')
	text('Tank Positions X', 60, 15)
	fill('red')
	text(p1.x, 15, 25)
	fill('blue')
	text(p2.x, 15, 35)
	fill('black')
	text('Tank Positions Y', 60, 45)
	fill('red')
	text(p1.y, 15, 55)
	fill('blue')
	text(p2.y, 15, 65)
	fill('black')
	text('Cannon Angle', 210, 15)
	fill('red')
	text(p1CannonAngle, 210, 25)
	fill('blue')
	text(p2CannonAngle, 210, 35)
	fill('black')
	text('Health Points', 410, 15)
	fill('red')
	text(p1HP, 410, 25)
	fill('blue')
	text(p2HP, 410, 35)
	fill('black')
	text('Current Turn', 610, 15)
	if(currentPlayer == 'p2') {
		fill('blue')
	} else {
		fill('red')
	}
	text(currentPlayer, 610, 30)
	textSize(25)
	fill('White')
	text('Hello ' + userName +'!', width / 2, 85)
	// text(mouseX, 510, 25)
	// text(mouseY, 510, 35)
}


// Function for aiming cannons and shooting projectile
function p1AimCannon() {
	// Move Tank Cannon
	if (kb.pressing('a') && !kb.pressing('shift') && currentPlayer == 'p1') {
		// Play movement sound
		cannonMove.play()
		p1Cannon.rotation -=3;
		p1CannonAngle = p1Cannon.rotation
	} else if (kb.pressing('d') && !kb.pressing('shift') && currentPlayer == 'p1') {
		// Play movement sound
		cannonMove.play()
		p1Cannon.rotation +=3;
		p1CannonAngle = p1Cannon.rotation
		if(p1CannonAngle >= 90) {
			p1Cannon.rotation = 90;
		}
	} else if (kb.pressing('space') && currentPlayer == 'p1') {
		// Play shoot sound
		cannonFire.play()

		if(!p1Proj) {
			// Create tank projectile
			p1Proj = new Group();
			p1Proj.img = tankShell
			p1Proj.x = p1Cannon.x;
			p1Proj.y = p1Cannon.y;
			p1Proj.amount = 1
			
			// Determine which direction the projectile will shoot
			if (p1CannonAngle <= 0) {
				p1Proj.vel.x = projVelocity - 12;
			} else {
				p1Proj.vel.x = projVelocity;
			}
			p1Proj.vel.y = projVelocity;
			if (p1Proj.y >= projMaxHeight) {
				p1Proj.vel.y = -12;
			}
		}

		if(p1Proj.x == width && p1Proj.y == height) {
			p1Proj.remove()
		}

		// Switch to the next players turn
		if(p1Proj) {
			currentPlayer = 'p2'
		}
	}
}

// Function for aiming cannons and shooting projectile
function p2AimCannon() {
	// Move Tank Cannon
	if (kb.pressing('left') && currentPlayer == 'p2') {
		// Play movement sound
		cannonMove.play()
		p2Cannon.rotation -=3;
		p2CannonAngle = p2Cannon.rotation
	} else if (kb.pressing('right') && currentPlayer == 'p2') {
		// Play movement sound
		cannonMove.play()
		p2Cannon.rotation +=3;
		p2CannonAngle = p2Cannon.rotation
		if(p2CannonAngle >= 90) {
			p2Cannon.rotation = 90;
		}
	} else if (kb.pressing('space') && currentPlayer == 'p2') {
		// Play shoot sound
		cannonFire.play()

		if(!p2Proj) {
			// Create tank projectile
			p2Proj = new Sprite();
			p2Proj.img = tankShell
			p2Proj.x = p2Cannon.x;
			p2Proj.y = p2Cannon.y;
			
			// Determine which direction the projectile will shoot
			if (p2CannonAngle <= 0) {
				p2Proj.vel.x = projVelocity - 12;
			} else {
				p2Proj.vel.x = projVelocity;
			}
			p2Proj.vel.y = projVelocity;
			if (p2Proj.y >= projMaxHeight) {
				p2Proj.vel.y = -12;
			}
		}

		// Switch to the next players turn
		if(p2Proj) {
			currentPlayer = 'p1'
		}
	}
}

// Function for detecting collisions
function detectCollisions() {
	if (p1Proj && p1Proj.collides(p2)) {
		// Play hit sound
		cannonHit.play()
		// Subtract HP from opposite player when projectile hits
		p2HP -= projPwr;
		// If the projectile hit enemy, bounce off the tank
		p1Proj.vel.x = -10
		p1Proj.vel.y = -10
	}
  
	if (p2Proj && p2Proj.collides(p1)) {
		// Play hit sound
		cannonHit.play()
		// Subtract HP from opposite player when projectile hits
		p1HP -= projPwr;
		// If the projectile hit enemy, bounce off the tank
		p2Proj.vel.x = +10
		p2Proj.vel.y = -10
	}
}