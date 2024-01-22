class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    const trashFolder = "./resources/trashes/";
    for (let obj of gameState.trashes) {
      this.load.image(obj.key, trashFolder + obj.img);
    }
    this.load.image("other", "./resources/bins/red-bin.png");
    this.load.image("organic", "./resources/bins/green-bin.png");
    this.load.image("recyclable", "./resources/bins/orange-bin.png");
  }

  init() {
    this.records = [];
    this.isGamePaused = false;
    this.score = 0;
    this.lives = 3;
  }

  create() {
    //create trash
    const trashes = this.physics.add.group();
    this.selectedTrash = this.getRandomElement(gameState.trashes);
    this.trash = trashes.create(400, 0, this.selectedTrash.key).setScale(2);

    //create bin
    const bins = this.physics.add.staticGroup();
    bins.create(150, 575, "other");
    bins.create(150 + 250, 575, "organic");
    bins.create(150 + 250 * 2, 575, "recyclable");

    //create score text
    this.scoreText = this.add.text(30, 30, `Score: ${this.score}`, {
      color: "#fff",
      fontSize: "30px",
    });

    //display live
    this.liveText = this.add.text(30, 60, `Lives: ${this.lives}`, {
      color: "#fff",
      fontSize: "30px",
    });

    //sorting rules
    this.physics.add.collider(trashes, bins, (trashObj, bin) => {
      {
        trashObj.destroy();

        //right bin
        if (bin.texture.key === this.selectedTrash.type) {
          this.score += gameState.scoring.reward;
          this.scoreText.setText(`Score: ${this.score}`);
        } /*wrong bin*/ else {
          this.score += gameState.scoring.punishment;
          this.scoreText.setText(`Score: ${this.score}`);
          this.lives -= 1;
          //console.log("sorting rules: -1 live");
          this.liveText.setText(`Lives: ${this.lives}`);
        }
        //save moves to record
        this.currentRecord = {
          selectedTrash: this.selectedTrash,
          sortedAs: bin.texture.key,
        };
        this.records.push(this.currentRecord);
        this.currentRecord = {};
        //console.log(this.records, "isPause:" + this.isGamePaused);

        //create another trash
        this.selectedTrash = this.getRandomElement(gameState.trashes);
        this.trash = trashes.create(400, 0, this.selectedTrash.key).setScale(2);
      }
    });
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();

    if (this.isGamePaused === true) {
      if (cursors.space.isDown) {
        this.scene.restart();
      }
      return;
    }

    //keyboard controls
    if (cursors.left.isDown) {
      this.trash.x -= 10;
    }
    if (cursors.right.isDown) {
      this.trash.x += 10;
    }
    if (cursors.down.isDown) {
      this.trash.y += 10;
    }

    //losing game
    if (this.lives === 0) {
      //console.log("looping losing game");
      this.physics.pause();
      this.isGamePaused = true;
      //console.log("losing game logic pauses the game");
      this.add.text(50, 250, `Game over\nPress space to restart`, {
        color: "#fff",
        fontSize: "24px",
      });
      console.log(this.records);
    }
  }

  getRandomElement(arr) {
    const randomI = Math.floor(Math.random() * arr.length);
    return arr[randomI];
  }
}
