// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyCJqQyBukXzrOnIMDjI9fiEKHEXIkEllf0",
	authDomain: "paratypers.firebaseapp.com",
	databaseURL: "https://paratypers.firebaseio.com",
	projectId: "paratypers",
	storageBucket: "paratypers.appspot.com",
	messagingSenderId: "661627077154",
	appId: "1:661627077154:web:e7dcdc860ed346a3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

var screens;
var currentScreen;
var possibleWords = [];
var parachuters = [];
var savedParachuters = [];
var score = 0;
var level = 1;
var lives = 3;
var gameOver = true;
var wordsPerLevel = 5;
var numSaved = 0;

const PARACHUTER_WIDTH = 100;
const PARACHUTER_HEIGHT = 100;

function setup() {
	var canvas = createCanvas(640, 640);
	canvas.parent('mycanvas');
	background(0, 255, 0);
  
    textSize(32);

	screens = [];
	setupMainMenu();
	setupPossibleWords();
}

function draw() {
	makeOnlyCurrentVisible();
	drawScreens();

	if (!gameOver) {
		if (frameCount % int(1000 / level) == 0) {
			addParachuter();
		} else if (frameCount % (180 - 10 * level) == 0 && parachuters.length == 0) {
			addParachuter();
		}
		drawParachuters();
		checkLives();
	}
}

function addParachuter() {
	let wordsForThisLevel = possibleWords.filter((w) => (w.length <= level + 2));
	let randomWord = wordsForThisLevel[int(random(wordsForThisLevel.length))];

	let newpara = new Parachuter(random(50, width - 50), 0, PARACHUTER_WIDTH, PARACHUTER_HEIGHT, randomWord);
	if (newpara.textIncomplete.x + newpara.textIncomplete.width >= width) {
		newpara.x = width / 2;
		newpara.textIncomplete.x = width / 2;
	}

	parachuters.push(newpara);
}

function drawScreens() {
	for (let screen of screens) {
		screen.drawScreen();
	}
}

function drawParachuters() {
	for (let p = parachuters.length - 1; p >= 0; p--) {
		parachuters[p].move();

		if (parachuters[p].y - 30 - parachuters[p].textComplete.height >= height) {
			parachuters.splice(p, 1);
			lives--;
			document.getElementById('errorSound').play();
			updateGameText();
		}
	}

	for (let s = savedParachuters.length - 1; s >= 0; s--) {
		savedParachuters[s].move();

		if (savedParachuters[s].x + savedParachuters[s].width <= 0) {
			savedParachuters.splice(s, 1);
		}
	}
}

function checkLives() {
	if (lives <= 0) {
		gameOver = true;

		let pos = findScreen('gameDone');
		if (pos == -1) {
			screens.push(new Screen('gameDone', false));
			pos = findScreen('gameDone');

			let gameOverBackground = new Rectangle('gameOverBackground', 0, 0, width, height, color(27, 98, 191));
			screens[pos].addObj(gameOverBackground);

			let tempText = new Text('tempText', 0, 0, color(0, 0, 0), 'Game Over', 60, false);

			let gameOverText = new Text('gameOverText', (width - tempText.width - 100) / 2, 80, color(204, 198, 200), 'Game Over', 60);
			screens[pos].addObj(gameOverText);

			tempText = new Text('tempText', 0, 0, color(0, 0, 0), 'Score: ' + int(score).toString(), 25, false);

			let gameOverScoreText = new Text('gameOverScoreText', (width - tempText.width + 60) / 2, tempText.height + 20 + gameOverText.y, color(204, 198, 200), 'Score: ' + int(score).toString(), 25);
			screens[pos].addObj(gameOverScoreText);

			let highScoresButton = new Button('highScoresButton', (width - 300 + 44) / 2, height - 2*75, 300, 75, color(235, 235, 235), color(255, 170, 0), 'View High Scores', 32);
			screens[pos].addObj(highScoresButton);

			tempText = new Text('tempText', 0, 0, color(0, 0, 0), '_ _ _', 60, false);

			let enterNameText = new Text('enterNameText', (width - tempText.width - 30) / 2, (height - tempText.height + 100) / 2, color(204, 198, 200), '_ _ _', 60);
			screens[pos].addObj(enterNameText);

			tempText = new Text('tempText', 0, 0, color(0, 0, 0), 'Enter Initials', 28, false);
			let instructionsText = new Text('nameInstructions', (width - tempText.width + 60) / 2, enterNameText.y - tempText.height - 80, color(204, 198, 200), 'Enter Initials', 28);
			screens[pos].addObj(instructionsText);
		}

		currentScreen = pos;
		makeOnlyCurrentVisible();
	}
}

window.addEventListener('click', function(e) {
	for (let screen of screens) {
		if (screen.visible) {
			for (let obj of screen.list) {
				if (obj.mouseOn(e.x, e.y)) {
					if (obj.name === 'playButton') {
						playButtonClicked();
					} else if (obj.name === 'howToPlay') {
						howToPlayButtonClicked();
					} else if (obj.name === 'fromHTPtoMM') {
						fromHTPtoMM();
					} else if (obj.name === 'highScoresButton') {
						if (screens[findScreen('gameDone')].list[4].text[screens[findScreen('gameDone')].list[4].text.length - 1] != '_') {
							showHighScores();
						}
					} else {
						obj.clicked();
					}
				}
			}
		}
	}
});

function enterName() {
	let pos = findScreen('enterName');

	if (pos == -1) {
		screens.push(new Screen('enterName', false));
		pos = findScreen('enterName');

		let enterNameBackground = new Rectangle('enterNameBackground', 0, 0, width, height, color(27, 98, 191));
		screens[pos].addObj(enterNameBackground);

		let tempText = new Text('tempText', 0, 0, color(0, 0, 0), '_ _ _', 80, false);

		let enterNameText = new Text('enterNameText', (width - tempText.width - 100) / 2, (height - tempText.height) / 2, color(204, 198, 200), '_ _ _', 80);
		screens[pos].addObj(enterNameText);

		tempText = new Text('tempText', 0, 0, color(0, 0, 0), 'Enter Initials', 50, false);
		let instructionsText = new Text('nameInstructions', (width - tempText.width - 100) / 2, enterNameText.y - tempText.height - 150, color(204, 198, 200), 'Enter Initials', 50);
		screens[pos].addObj(instructionsText);
	}

	currentScreen = pos;
	makeOnlyCurrentVisible();
}

function showHighScores() {
	document.getElementById('clickSound').play();

	score = int(score);
	let finalScore = score;
	let initials = screens[findScreen('gameDone')].list[4].text;

	firebase.database().ref('scores/').once('value').then(function(snapshot) {
		let array = snapshot.val();
		let length = array.length;

		// if (snapshot.val() != null) {
		// 	let length = snapshot.val().length;
		// }

		// if (length < 9) {
		// 	array = [];
		// 	for(let x = length; x < 9; x++) {
		// 		firebase.database().ref('scores/' + x).set({
		// 			name: 'I V N',
		// 			score: 0
		// 		});
		// 		let toPush = {
		// 			name: 'I V N',
		// 			score: 0
		// 		};
		// 		array.push(toPush);
		// 	}
		// }

		firebase.database().ref('scores/' + length).set({
			name: initials,
			score: finalScore
		});

		let test = {
			name: initials,
			score: finalScore
		};

		array.push(test);
		let sortedArray = quickSort(array, 0, array.length - 1);

		let pos = findScreen('showHighScores');

		if (pos == -1) {
			screens.push(new Screen('showHighScores', false));
			pos = findScreen('showHighScores');

			let showScoresBackground = new Rectangle('showScoresBackground',  0, 0, width, height, color(27, 98, 191));
			screens[pos].addObj(showScoresBackground);

			let tempText = new Text('tempText', 0, 0, color(0, 0, 0), 'High Scores', 40, false);

			let highScoresText = new Text('highScoresText', (width - tempText.width) / 2, 50, color(204, 198, 200), 'High Scores', 40);
			screens[pos].addObj(highScoresText);

			let scoreShown = false;

			for (let i = 0; i < 9; i++) {
				let someScore = new Text('someScore' + i.toString(), 150, 45 * (i + 1) + 80, color(204, 198, 200), (i + 1).toString() + '. ' + sortedArray[i].name + ': ' + sortedArray[i].score, 30);
				if (sortedArray[i].name == initials && sortedArray[i].score == score && !scoreShown) {
					someScore.color = color(255, 170, 0);
					scoreShown = true;
				}

				screens[pos].addObj(someScore);
			}

			if (!scoreShown) {
				let ownScore = new Text('ownScore', 130, 575, color(255, 170, 0), findPosition(initials, finalScore, sortedArray).toString() + '. ' + initials + ': ' + score, 30);
				screens[pos].addObj(ownScore);
			}
		}

		currentScreen = pos;
		makeOnlyCurrentVisible();
	});
}

function findPosition(initials, score, array) {
	for (let i = 0; i < array.length; i++) {
		if (array[i].name == initials && array[i].score == score) {
			return i + 1;
		}
	}

	return -1;
}

window.onkeypress = function(e) {
	if (!gameOver && parachuters.length > 0) {
		let trooper = parachuters[0];
		let letterTyped = String.fromCharCode(e.keyCode);

		if (trooper.word[trooper.completedLetters] == letterTyped) {
			trooper.completedLetters++;
			score += 5;
			updateGameText();

			if (trooper.completedLetters == trooper.word.length) {
				trooper.completed();
				parachuters.splice(0, 1);
				savedParachuters.push(trooper);
				if (numSaved >= wordsPerLevel) {
					numSaved = 0;
					level++;
					wordsPerLevel++;
					lives++;
					score += 100;
					document.getElementById('nextLevelSound').play();
					updateGameText();
				}
			}
		} else {
			trooper.completedLetters = 0;
		}
	}

	if (currentScreen == findScreen('gameDone')) {
		if (e.keyCode >= 32) {
			for (let x = 0; x < screens[currentScreen].list[4].text.length; x++) {
				if (screens[currentScreen].list[4].text[x] == '_') {
					screens[currentScreen].list[4].text = screens[currentScreen].list[4].text.substring(0, x) + String.fromCharCode(e.keyCode).toUpperCase() + screens[currentScreen].list[4].text.substr(x + 1);
					break;
				}
			}
		}
	}
};

window.onkeydown = function(e) {
	if (currentScreen == findScreen('gameDone')) {
		if ((e.keyCode == 8 || e.keyCode == 46) && screens[currentScreen].list[4].text[0] != '_') {
			for (let i = screens[currentScreen].list[4].text.length - 1; i >= 0; i--) {
				if (screens[currentScreen].list[4].text[i] != '_' && screens[currentScreen].list[4].text[i] != ' ') {
					screens[currentScreen].list[4].text = screens[currentScreen].list[4].text.substring(0, i) + '_' + screens[currentScreen].list[4].text.substr(i + 1);
					break;
				}
			}
		} else if (e.keyCode == 13 && screens[currentScreen].list[4].text[screens[currentScreen].list[4].text.length - 1] != '_') {
			showHighScores();
		}
	}
};

function setupPossibleWords() {
	possibleWords = ['the', 'what', 'hello', 'goal', 'apprentice', 'whatever', 'you bet', 'type', 'fast', 'speed',
					'slow', 'toaster', 'oven', 'microwave', 'refrigerator', 'ninja', 'monkey', 'penguin', 'slug',
					'dog', 'cat', 'mom', 'dad', 'brother', 'sister', 'pet', 'parrot', 'course', 'golf', 'tennis',
					'soccer', 'hockey', 'roll', 'rock', 'stone', 'word', 'tall', 'short', 'surprise', 'January',
					'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November',
					'December', 'month', 'year', 'birthday', 'name', 'NYU', 'impossible', 'inconceivable', 'movie',
					'alpha', 'whiskey', 'tango', 'foxtrot', 'bravo', 'Courant', 'number', 'theory', 'logic', 'proofs',
					'topology', 'program', 'vampire', 'pirate', 'monster', 'knight', 'pony', 'king', 'castle'];
}

function setupMainMenu() {
	screens.push(new Screen('mainMenu'));
  
    let mainMenuBack = new Rectangle('mainMenuBack', 0, 0, width, height, color(27, 98, 191));
    screens[0].addObj(mainMenuBack);

	let titleText = new Text('titleText', 220, 100, color(204, 198, 200), 'Paratypers', 50);
	screens[0].addObj(titleText);

	let playButton = new Button('playButton', 250, 270, 175, 75, color(235, 235, 235), color(255, 170, 0), 'Play', 32);
	screens[0].addObj(playButton);

	let howToPlayButton = new Button('howToPlay', 237.5, 360, 200, 75, color(235, 235, 235), color(255, 170, 0), 'How to Play', 32);
	screens[0].addObj(howToPlayButton);

	currentScreen = 0;
}

function playButtonClicked() {
	document.getElementById('clickSound').play();

	let pos = findScreen('gameScreen');

	if (pos == -1) {
		screens.push(new Screen('gameScreen', false));
		pos = findScreen('gameScreen');

		let playBackground = new Image('playBackground', 0, 0, width, height, 'skyBackground');
		screens[pos].addObj(playBackground);

		let scoreText = new Text('scoreText', 10, height - screens[0].list[2].text.height, color(0, 0, 0), 'Score: ' + int(score).toString(), 32);
		screens[pos].addObj(scoreText);

		let tempText = new Text('tempText', 0, 0, color(0, 0, 0), 'Lives: ' + lives.toString(), 32);

		let livesText = new Text('livesText', width - tempText.width - 10, scoreText.y, color(0, 0, 0), 'Lives: ' + lives.toString(), 32);
		screens[pos].addObj(livesText);

		tempText = new Text('tempText', 0, 0, color(0, 0, 0), 'Level: ' + level.toString(), 32);

		let levelText = new Text('levelText', livesText.x - scoreText.x - scoreText.width - tempText.width, scoreText.y, color(0, 0, 0), 'Level: ' + level.toString(), 32);
		screens[pos].addObj(levelText);
	}

	gameOver = false;

	currentScreen = pos;
	makeOnlyCurrentVisible();

	addParachuter();
}

function updateGameText() {
	if (currentScreen == findScreen('gameScreen')) {
		for (let i = 0; i < screens[currentScreen].list.length; i++) {
			if (screens[currentScreen].list[i].name == 'livesText') {
				screens[currentScreen].list[i].text = 'Lives: ' + lives.toString();
				screens[currentScreen].list[i].updateHeightWidth();
				screens[currentScreen].list[i].x = width - screens[currentScreen].list[i].width - 10;
			}

			if (screens[currentScreen].list[i].name == 'scoreText') {
				screens[currentScreen].list[i].text = 'Score: ' + int(score).toString();
			}

			if (screens[currentScreen].list[i].name == 'levelText') {
				screens[currentScreen].list[i].text = 'Level: ' + level.toString();
			}
		}
	}
}

function howToPlayButtonClicked() {
	document.getElementById('clickSound').play();

	let pos = findScreen('howToPlayScreen');

	if (pos === -1) {
		screens.push(new Screen('howToPlayScreen', false));
		pos = findScreen('howToPlayScreen');

		let howToPlayBackground = new Rectangle('HTPBackground', 0, 0, width, height, color(27, 98, 191));
    	screens[pos].addObj(howToPlayBackground);

		let instructions = '\nType the words as they appear on the' + '\nscreen.' +
						'\n\nPoints will be awarded for the length of' + '\nthe word and the speed at which it was' + '\ntyped.' +
						'\n\nYou will lose a life for every parachuter' + '\nthat reaches the bottom.' +
						'\n\nTry to get a high score!';
		let instructionsText = new Text('instructionsText', 30, 100, color(255, 255, 255), instructions, 32, true);
		screens[pos].addObj(instructionsText);
      
        let backToMainMenu = new Button('fromHTPtoMM', 450, 20, 175, 75, color(235, 235, 235), color(255, 170, 0), 'Back', 32);
        screens[pos].addObj(backToMainMenu);
	}

	currentScreen = pos;
	makeOnlyCurrentVisible();
}

function fromHTPtoMM() {
	document.getElementById('clickSound').play();

    currentScreen = 0;
    makeOnlyCurrentVisible();
}

function makeOnlyCurrentVisible() {
	for (let i = 0; i < screens.length; i++) {
		if (i === currentScreen) {
			screens[i].visible = true;
		} else {
			screens[i].visible = false;
		}
	}
}

function findScreen(screenName) {
	for (let i = 0; i < screens.length; i++) {
		if (screens[i].name === screenName) {
			return i;
		}
	}

	return -1;
}

function addScreen(screen) {
	for (let i = 0; i < screens.length; i++) {
		if (screen.name.localeCompare(screens[i].name) < 0) {
			screens.splice(i, 0, screen);
		}
	}
}

function swap(items, leftIndex, rightIndex){
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}

function partition(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)].score, //middle element
        i       = left, //left pointer
        j       = right; //right pointer
    while (i <= j) {
        while (items[i].score > pivot) {
            i++;
        }
        while (items[j].score < pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(items, left, right) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right);
        }
    }
    return items;
}