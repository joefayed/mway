var canvas, stage;
var bgScreen;
var speed = 17000;
var target = 0;
var speedDiff = 0.85;
var isDown = false;
var originalTarget = 0;
var levels = 6;
var levelSlice;
var animationDone = false;
var hooray = null;
var goingUp = false;
var container;
var ufoSound = null;

function loadAssets() {
	manifest = [
		{ src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1524180/blink.mp3", id: "blink" },
		{ src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1524180/grunt_1.mp3", id: "grunt" },
		{ src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1524180/ufo.mp3", id: "ufo" },
	];

	loader = new createjs.LoadQueue(true);
	loader.installPlugin(createjs.Sound);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(manifest);
}

function init() {
	//This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
	canvas = document.getElementById("canvas");
	stage = new createjs.Stage(canvas);
	createjs.Touch.enable(stage);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	levelSlice = canvas.height;

	trees = new lib.Trees();

	container = new createjs.Container();

	container.scaleX = container.scaleY = 1;
	stage.addChild(container);

	bgScreen = new createjs.Container();

	giraffe = new lib.GiraffeMC();
	giraffe.scaleX = giraffe.scaleY = 0.60;
	giraffe.x = canvas.width >> 1;
	giraffe.y = canvas.height >> 1;

	head = giraffe.head;
	headPosX = head.x;
	headPosY = head.y;

	instructions = new lib.Arrow();

	leftEye = head.leftEye;
	rightEye = head.rightEye;

	leftEar = head.leftEar;
	rightEar = head.rightEar;

	body = new lib.Body();
	body.scaleX = body.scaleY = giraffe.scaleX
	tail1 = new lib.Tail();
	gBody = giraffe.body;
	gBody.alpha = 0;

	body.alpha = 1;


	tail = giraffe.tail;
	tail.alpha = 0;

	startCuteAnimations();

	floor = buildFloor();
	trees.x = canvas.width >> 1;

	bgContainer = new createjs.Container();
	bg = new createjs.Shape();
	bg.width = canvas.width;
	bg.height = levelSlice * levels;

	bgContainer.y = -(bg.height) + levelSlice;
	bg.graphics.beginLinearGradientFill(["#744d6b", "#0098D1"], [0, 1], 0, bg.height / 6, 0, bg.height / 2).dr(0, 0, bg.width * 2, bg.height);
	bg.cache(0, 0, bg.width * 2, bg.height);
	bg.x = -bg.width >> 1;

	bg.alpha = 1;
	moon = new lib.Moon();
	moon.scaleX = moon.scaleY = .70
	stars = new lib.Stars();

	bgContainer.addChild(bg, stars, moon);

	floor.x = -bg.width >> 1;
	floor.y = (bg.height) - floor.height;
	trees.y = floor.y + 8;

	bgScreen.y = -(bg.height) + levelSlice;
	container.addChild(bgContainer);

	var point = gBody.localToGlobal(0, 0);
	var point1 = tail.localToGlobal(0, 0);

	body.x = point.x - 2;
	body.y = floor.y - 90;

	bodyPosX = body.x;
	bodyPosY = body.y;

	mouthPosX = head.mouth.x;
	mouthPosY = head.mouth.y;

	tail1.x = point1.x;
	tail1.y = body.y + 55;

	stars.x = bg.width * 0.25;
	stars.y = bg.height * 0.05;

	moon.x = bg.width * 0.75;
	moon.y = bg.height * 0.05;


	ufoContainer = new createjs.Container();
	for (var i = 0; i < 5; i++) {
		var ufo = new lib.UFO();
		ufo.oldX = 0;
		ufo.oldY = 0;
		ufo.x = Math.random() * canvas.width;
		ufo.y = (bg.height * .05) + Math.random() * canvas.height / 2;
		ufo.offY = ufo.y;
		ufo.scaleX = ufo.scaleY = 0.5 + Math.random();
		ufo.speed = 5 * ufo.scaleX;
		//ufo.alpha = ufo.scaleX
		ufo.rate = Math.random() / 10;
		ufo.angle = 0;
		ufoContainer.addChild(ufo)
	}

	bird = new lib.Bird();
	bird.oldX = 0;
	bird.oldY = 0;
	bird.x = Math.random() * canvas.width;
	bird.y = (bg.height * .82) + Math.random() * canvas.height / 2;
	bird.offY = bird.y;
	bird.angle = 0;

	bird2 = new lib.Bird2();
	bird2.oldX = 0;
	bird2.oldY = 0;
	bird2.x = Math.random() * canvas.width;
	bird2.y = (bg.height * .83) + Math.random() * canvas.height / 2;
	bird2.offY = bird2.y;
	bird2.angle = 0;

	cloud1 = new lib.Cloud1();
	cloud2 = new lib.Cloud2();
	cloud3 = new lib.Cloud3();
	cloud4 = new lib.Cloud4();
	cloud5 = new lib.Cloud5();

	cloud1.x = bg.width * 0.15;
	cloud1.y = bg.height * 0.45;

	cloud2.x = bg.width * 0.20;
	cloud2.y = bg.height * 0.45;

	cloud3.x = bg.width * 0.80;
	cloud3.y = bg.height * 0.5;

	cloud4.x = bg.width * 0.2;
	cloud4.y = bg.height * 0.9;

	cloud5.x = bg.width * 0.8;
	cloud5.y = bg.height * 0.85;

	cloudContainer = new createjs.Container();
	cloudContainer.addChild(cloud2, cloud1, cloud3, cloud4, cloud5);

	bgScreen.addChild(floor, trees, tail1, body, moon, bird, bird2);

	originalTarget = target = bgScreen.y;

	var pt = moon.localToGlobal(0, 0);

	ufoContainer.y = pt.y;


	container.addChild(cloudContainer, bgScreen, giraffe, ufoContainer);

	instructions.x = giraffe.x + 207 * giraffe.scaleX;
	instructions.y = giraffe.y;
	instructions.visible = true;
	stage.addChild(instructions);

	neck = new createjs.Container();
	neckBG = new createjs.Shape();
	neckBG.graphics.f("#F49131").dr(0, 0, 44, bg.height);
	var spots = new lib.Spots();
	spots.scaleX = spots.scaleY = 0.63;
	spots.x = 21;
	neck.addChild(neckBG, spots);
	var point = head.localToGlobal(0, 0);
	neck.x = (point.x) - 17;
	//point = body.localToGlobal(0,0);
	neck.y = point.y + 15;//point.y-145;

	neckPosX = neck.x;
	neckPosY = neck.y;
	container.addChildAt(neck, 2);

	//Registers the "tick" event listener.
	createjs.Ticker.setFPS(lib.properties.fps);
	createjs.Ticker.addEventListener("tick", tick);

	loadAssets();
}

function handleComplete() {
	stage.addEventListener("stagemousedown", handleDown);
	stage.addEventListener("stagemouseup", handleUp);
	window.addEventListener("resize", handleResize);

	hooray = createjs.Sound.createInstance("hooray");
	ufoSound = createjs.Sound.createInstance("ufo");
	scream = createjs.Sound.createInstance("scream");

	handleResize()
}

function handleResize(event) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	levelSlice = canvas.height;

	bg.width = canvas.width;
	bg.height = levelSlice * levels;

	floor.height = canvas.height * .30;
	floor.width = canvas.width * 2;

	giraffe.x = canvas.width >> 1;
	giraffe.y = canvas.height >> 1;

	instructions.x = giraffe.x + 207 * giraffe.scaleX;
	instructions.y = giraffe.y;

	headPosX = head.x;
	headPosY = head.y;

	leftEye = head.leftEye;
	rightEye = head.rightEye;

	leftEar = head.leftEar;
	rightEar = head.rightEar;

	bgContainer.y = -(bg.height) + levelSlice;

	bgContainer.y = -(bg.height) + levelSlice;
	bg.graphics.clear().beginLinearGradientFill(["#744d6b", "#0098D1"], [0, 1], 0, bg.height / 6, 0, bg.height / 2).dr(0, 0, bg.width * 2, bg.height);
	bg.cache(0, 0, bg.width * 2, bg.height);


	bg.x = -bg.width >> 1;

	floor.graphics.clear().f("#B59365").dr(0, 0, floor.width, floor.height);
	//floor.updateCache(0,0,floor.width, floor.height);
	floor.x = -bg.width >> 1;
	floor.y = (bg.height) - floor.height;

	trees.x = canvas.width >> 1;
	trees.y = floor.y + 8;

	stars.y = bg.height * 0.05;

	bird.y = (bg.height * .82) + Math.random() * canvas.height / 2;
	bird.offY = bird.y;

	bird2.y = (bg.height * .83) + Math.random() * canvas.height / 2;

	cloud1.x = bg.width * 0.15;
	cloud1.y = bg.height * 0.45;

	cloud2.x = bg.width * 0.20;
	cloud2.y = bg.height * 0.45;

	cloud3.x = bg.width * 0.80;
	cloud3.y = bg.height * 0.5;

	cloud4.x = bg.width * 0.2;
	cloud4.y = bg.height * 0.9;

	cloud5.x = bg.width * 0.8;
	cloud5.y = bg.height * 0.85;
	bird2.offY = bird2.y;

	var point = gBody.localToGlobal(0, 0);
	var point1 = tail.localToGlobal(0, 0);

	body.x = point.x - 2;
	body.y = floor.y - 90;

	bodyPosX = body.x;
	bodyPosY = body.y;

	mouthPosX = head.mouth.x;
	mouthPosY = head.mouth.y;

	tail1.x = point1.x;
	tail1.y = body.y + 55;

	stars.x = bg.width * 0.25;
	stars.y = bg.height * 0.05;

	moon.x = bg.width * 0.85;
	moon.y = bg.height * 0.05;

	bgScreen.y = -(bg.height) + levelSlice;

	originalTarget = bgScreen.y;

	var pt = moon.localToGlobal(0, 0);
	ufoContainer.y = pt.y;

	var point = head.localToGlobal(0, 0);
	neck.x = (point.x) - 17;
	//point = body.localToGlobal(0,0);
	neck.y = point.y + 15;//point.y-145;

	neckPosX = neck.x;
	neckPosY = neck.y;

	stage.update();

}

function startCuteAnimations() {
	createjs.Tween.get(tail1, { loop: -1, bounce: true })
		.wait(1000)
		.to({ rotation: getRange(-30, 30) }, 300 + Math.random() * 500 | 0)
		.wait(500);

	createjs.Tween.get(leftEar, { loop: -1, bounce: true })
		.wait(3000)
		.to({ rotation: getRange(-30, 30) }, 300 + Math.random() * 500 | 0)
		.wait(3000)
		.to({ rotation: getRange(-15, 30) }, 500).wait(1000).call(function () {

		});
	createjs.Tween.get(rightEar, { loop: -1, bounce: true })
		.wait(2500)
		.to({ rotation: getRange(-50, 45) }, 300 + Math.random() * 500 | 0)
		.wait(2500)
		.to({ rotation: getRange(-30, 30) }, 500).wait(1000).call(function () {

		});

	createjs.Tween.get(this, { loop: -1 }).wait(2000).call(function () {
		leftEye.gotoAndStop(1);
		rightEye.gotoAndStop(1);
	}).wait(250).call(function () {
		leftEye.gotoAndStop(0);
		rightEye.gotoAndStop(0);
	});
}

function handleDown(event) {
	speed = 17000;
	isDown = true;
	goingUp = true;

	if (instructions.visible == true) {
		setTimeout(function () {
			createjs.Tween.get(instructions).to({ alpha: 0 }, 1000).call(function () {
				instructions.visible = false;
			});
		}, 10)

	}
	grunt = createjs.Sound.play("grunt", { loop: 0 });

	animationDone = false;

	target = 0;
	gBody.visible = false;
	body.visible = true;
	head.mouth.gotoAndStop(2);
	createjs.Tween.removeAllTweens();
	tail.visible = false;
	rightEar.rotation = -45;
	leftEar.rotation = 45;
	leftEye.gotoAndStop(1);
	rightEye.gotoAndStop(1);
	createjs.Tween.get(rightEar, { loop: -1, bounce: true }).to({ rotation: -45 }, 100).to({ rotation: -35 }, 100);
	createjs.Tween.get(leftEar, { loop: -1, bounce: true }).to({ rotation: 45 }, 100).to({ rotation: 35 }, 100)
}

function handleUp(event) {
	speed = 17000;
	isDown = false;
	goingUp = false;
	grunt.stop();

	setTimeout(function () {
		setMusicVolume(ufoSound, 0, 1500);
	}, 10)
	setMusicVolume(scream, 0, 500);

	target = originalTarget;
	animationDone = false;
	tail.visible = true;
	rightEar.rotation = 0;
	leftEar.rotation = 0;
	leftEye.gotoAndStop(0);
	rightEye.gotoAndStop(0);
	createjs.Tween.removeAllTweens();
	head.mouth.gotoAndStop(0);

	startCuteAnimations();
}

function buildFloor() {
	var s = new createjs.Shape();
	s.height = canvas.height * .30;
	s.width = canvas.width * 2;
	s.graphics.f("#B59365").dr(0, 0, s.width, s.height);
	//s.cache(0,0,s.width, s.height);
	return s;
}

function getRange(min, max) {
	var scale = max - min;
	return Math.random() * scale + min;
}

function rotateHead() {
	var dx = stage.mouseX - head.x;
	var dy = stage.mouseY - head.y;
	var angle = -40 + Math.atan2(dy, dx) * 180 / Math.PI;
	var targ = Math.max(-13, Math.min(angle, 46));
	head.rotation += (targ - head.rotation) / 10;
}

function move() {
	speed *= speedDiff;
	bgScreen.y += (target - bgScreen.y) / speed;
	bgContainer.y = bgScreen.y;
	ufoContainer.y = bgScreen.y;
	cloudContainer.y = bgScreen.y;
	if (Math.abs(target - bgScreen.y) < 1) {
		animationDone = true;
	}
}

function moveBirds() {
	bird.x = (bird.x + 5) % (bg.width);
	bird.y = bird.offY + Math.sin(bird.angle) * 20;
	var dy = bird.oldY - bird.y;
	var dx = bird.oldX - bird.x;
	bird.rotation = 180 + Math.atan2(dy, dx) * 180 / Math.PI;
	bird.angle += 0.1;
	bird.oldX = bird.x;
	bird.oldY = bird.y;

	bird2.x = (bird.x + 3) % (bg.width);
	bird2.y = bird2.offY + Math.sin(bird2.angle) * 30;
	var dy = bird2.oldY - bird2.y;
	var dx = bird2.oldX - bird2.x;
	bird2.rotation = 180 + Math.atan2(dy, dx) * 180 / Math.PI;
	bird2.angle += 0.15;
	bird2.oldX = bird2.x;
	bird2.oldY = bird2.y;
}

function moveUFO() {
	var l = ufoContainer.numChildren;
	for (var i = 0; i < l; i++) {
		var ufo = ufoContainer.getChildAt(i);
		ufo.x = (ufo.x + ufo.speed) % (bg.width);
		ufo.y = ufo.offY + Math.sin(ufo.angle) * 20;
		var dy = ufo.oldY - ufo.y;
		var dx = ufo.oldX - ufo.x;
		ufo.rotation = 180 + Math.atan2(dy, dx) * 180 / Math.PI;
		ufo.angle += ufo.rate;
		ufo.oldX = ufo.x;
		ufo.oldY = ufo.y;
	}
}

function moveClouds() {
	cloud1.x = (cloud1.x + 1.5) % (bg.width);
	cloud2.x = (cloud2.x + 1.91) % (bg.width);
	cloud3.x = (cloud3.x + 1.21) % (bg.width);
	cloud4.x = (cloud4.x + 1.02) % (bg.width);
	cloud5.x = (cloud5.x + 1.01) % (bg.width);
}

function shake() {
	head.x = headPosX + Math.random() * 5;
	head.y = headPosY + Math.random() * 2;

	var rand = Math.random() * 3;

	body.x = bodyPosX + rand;
	body.y = bodyPosY + Math.random() * 2;

	neck.x = neckPosX + rand;
}

function shakeMouth() {
	head.mouth.x = mouthPosX + Math.random() * 5;
	head.mouth.y = mouthPosY + Math.random() * 2;
}

function tick(event) {
	moveBirds();
	moveUFO();
	moveClouds();

	if (animationDone == true) {
		if (isDown) {
			if (goingUp === true) {
				//hooray.volume = 1;
				ufoSound.volume = 1;
				scream.volume = 1;
				//hooray.play();
				ufoSound.play();
				scream.play();
				head.mouth.gotoAndStop(3);
				leftEye.gotoAndStop(0);
				rightEye.gotoAndStop(0);
				shakeMouth();
			}
		}
		stage.update();
		return;
	}

	if (isDown === true) {
		shake();
	} else {
		head.x = headPosX;
		head.y = headPosY;

		body.x = bodyPosX;
		body.y = bodyPosY;

		neck.x = neckPosX;

		head.mouth.x = mouthPosX;
		head.mouth.y = mouthPosY;
	}
	move();

	rotateHead();

	stage.update();
}

function setMusicVolume(music, volume, time) {
	createjs.Tween.get(music, { override: true }).to({ volume: volume }, time).call(function () {
		//music.volume = 1;
	});
}

init()