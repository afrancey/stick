        //https://phaser.io/examples/v3/view/animation/create-animation-from-sprite-sheet
        //https://phaser.io/examples/v2/sprites/spritesheet
        //https://phaser.io/examples/v3/view/input/keyboard/cursor-keys
        //https://www.npmjs.com/package/http-server
        //https://learn.microsoft.com/en-us/archive/msdn-magazine/2015/march/game-development-a-web-game-in-an-hour
        // https://phaser.io/examples/v2/sprites/move-a-sprite
        var cursors;
        var logo;
        var sprite;
        var cody;
        var sticklogo;
        var buildings = {};
        var interfaces = {};
        var portals = {};
        var walking = false;
        var flipped = false;
        var debug = false;
        var lastPressed = "null";
        var speed = 1;
    
        var main_portal = {x:110, y:360, d:10};
    
        var invItems = {};
    
        var mouseX = 0;
        var mouseY = 0;
        var text;
    
        var gameState = "main_menu";
        var music = {};
        var musicPlaying = false;
    
        var config = {
            type: Phaser.AUTO,
            width: 1960,
            height: 800,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 200 }
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update,
            }
        };
    
        var game = new Phaser.Game(config);
    
        function preload ()
        {
            //this.load.setBaseURL("http://127.0.0.1:8080");
            this.load.setBaseURL("http://192.168.0.69:8080");
    
            this.load.image("bank", '/../assets/buildings/bank.png');
            this.load.image("main", '/../assets/interfaces/interface_main2.png');
    
            this.load.spritesheet('me', 'assets/sprites/stick_walk_1_37x45.png',{ frameWidth: 37, frameHeight: 45 });
    
            //https://www.html5gamedevs.com/topic/36016-make-animation-from-separate-files-ie-not-spritesheet/
            for (var i = 0; i < 10; i++){
                 this.load.image('crystal' + (i+1).toString(), 'assets/sprites/C/crystal' + (i+1).toString() + '.png');
            }
    
            for (var i = 0; i < 9; i++){
                 this.load.image('sl' + i.toString(), 'assets/sprites/sticklogo/sl' + i.toString() + '.png');
            }
    
            for (var i = 0; i < 9; i++){
                 this.load.image('c' + i.toString(), 'assets/sprites/circle/c' + i.toString() + '.png');
            }
    
            this.load.audio('theme', ['assets/audio/stick2.mp3', 'assets/audio/stick2.ogg']);
            this.load.audio('soft', ['assets/audio/sticksoft.mp3']);
        }
    
        function create ()
        {
            this.w = this.cameras.main.width;
            this.h = this.cameras.main.height;
    
            this.black = new Phaser.Display.Color(0, 0, 0);
            this.cameras.main.setBackgroundColor("FFFFFF");
            
            buildings["bank"] = this.add.image(0,0, 'bank', '__BASE').setOrigin(0,0);
            buildings["bank"].setScale(0.5);
            interfaces["main"] = this.add.image(800,0, 'main', '__BASE').setOrigin(0,0);
            interfaces["main"].setScale(0.5);
    
            cursors = this.input.keyboard.createCursorKeys();
    
            this.anims.create({
            key: 'C',
            frames: [
                { key: 'crystal1'},
                { key: 'crystal2'},
                { key: 'crystal3'},
                { key: 'crystal4'},
                { key: 'crystal5'},
                { key: 'crystal6'},
                { key: 'crystal7'},
                { key: 'crystal8'},
                { key: 'crystal9'},
                { key: 'crystal10'},
            ],
            frameRate: 8,
            repeat: -1
            });
    
            invItems["C"] = this.add.sprite(1160, 455, 'crystal1');
            invItems["C"].setScale(0.5);
            invItems["C"].play('C');
    
            this.anims.create({
            key: 'sl',
            frames: [
                { key: 'sl0'},
                { key: 'sl1'},
                { key: 'sl2'},
                { key: 'sl3'},
                { key: 'sl4'},
                { key: 'sl5'},
                { key: 'sl6'},
                { key: 'sl7'},
                { key: 'sl8'},
                { key: 'sl9'},
            ],
            frameRate: 8,
            repeat: -1
            });
    
            this.anims.create({
            key: 'spin',
            frames: [
                { key: 'c0'},
                { key: 'c1'},
                { key: 'c2'},
                { key: 'c3'},
                { key: 'c4'},
                { key: 'c5'},
                { key: 'c6'},
                { key: 'c7'},
                { key: 'c8'},
                { key: 'c9'},
            ],
            frameRate: 32,
            repeat: -1
            });
            
            portals["main_circle"] = this.add.sprite(main_portal.x, main_portal.y, 'c1');
            portals["main_circle"].setScale(0.5);
            portals["main_circle"].play('spin');
    
            sticklogo = this.add.sprite(this.w/2, this.h/2, 'sl0');
    
            sticklogo.setScale(0.5);
            sticklogo.play('sl');
    
            // v3
    
            this.anims.create({
                key: 'walk',
                frames: this.anims.generateFrameNumbers('me', { frames: [ 0, 1, 2, 3] }),
                frameRate: 8,
                repeat: -1
            });
    
    
            cody = this.add.sprite(600, 370);
    
            cody.setScale(2);
    
            text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
    
            music["theme"] = this.sound.add('theme');
            music["soft"] = this.sound.add('soft');
    
            //music.play(); // will start playback when user interacts with browser in any way
    
        }
    
        function update ()
        {
            if ((Math.sqrt(Math.pow(cody.x - main_portal.x, 2) + Math.pow(cody.y - main_portal.y, 2))) < main_portal.d){
                gameState = "lvl1";
                musicPlaying = false;
            }
    
            if (gameState == "main_menu"){
                buildings["bank"].visible = false;
                interfaces["main"].visible = false;
                invItems["C"].visible = false;
                sticklogo.visible = true;
                portals["main_circle"].visible = true;
    
            } else {
                sticklogo.visible = false;
                buildings["bank"].visible = true;
                interfaces["main"].visible = true;
                invItems["C"].visible = true;
    
            }
    
            var p = this.input.activePointer;
            var other = (Math.sqrt(Math.pow(cody.x - main_portal.x, 2) + Math.pow(cody.y - main_portal.y, 2))).toString();
            var other2 = ((Math.sqrt(Math.pow(cody.x - main_portal.x, 2) + Math.pow(cody.y - main_portal.y, 2))) < main_portal.d).toString();
            var other3 = main_portal.d.toString();
    
            if (debug){
                text.setText(['x: ' + p.x,'y: ' + p.y,'me_x: ' + cody.x,'me_y: ' + cody.y,"gameState: " + gameState, "other: " + other, "other: " + other2, "other: " + other3]);
            }
            var thisAnim = cody;
    
            var keyDown = false;
    
            if (cursors.left.isDown)
            {
                thisAnim.x-=speed;
                keyDown = true;
                if (lastPressed == "right"){
                    thisAnim.toggleFlipX();
                }
                lastPressed = "left";
    
            }
            else if (cursors.right.isDown)
            {
                thisAnim.x+=speed;
                keyDown = true;
                if (lastPressed == "left"){
                    thisAnim.toggleFlipX();
                }
                lastPressed = "right";
            }
    
            if (cursors.up.isDown)
            {
                thisAnim.y-=speed;
                keyDown = true;
            }
            else if (cursors.down.isDown)
            {
                thisAnim.y+=speed;
                keyDown = true;
            }
    
            if (keyDown){
                if (!musicPlaying){
                    music["theme"].play();
                    musicPlaying = true;
                    if (gameState == "lvl1"){
                        music["theme"].stop();
                        music["soft"].play();
                    }
                }
    
                if (!walking){
                    thisAnim.play("walk"); 
                    walking = true;
                }
    
                if (flipped){
                    thisAnim.toggleFlipX();
                }
            } else {
                walking = false;
                cody.anims.stop();
            }
        }