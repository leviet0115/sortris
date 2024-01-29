class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    const trashFolder = "./resources/trashes/";
    for (let obj of gameState.trashes) {
      this.load.image(obj.key, trashFolder + obj.img);
    }

    console.log(gameState.bins);
    gameState.bins.forEach((bin) => this.load.image(bin.key, bin.url));
  }

  init(data) {
    this.records = [];
    this.isGameLost = data.isGameLost || false;
    this.score = 0;
    this.lives = 3;
    this.currentRecord = {};
    this.cursors = this.input.keyboard.createCursorKeys();
    this.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.selectedTrash = this.getRandomElement(gameState.trashes);
  }

  create() {
    this.physics.world.setBounds(0, 0, 800, 600, true, true, true, true);
    //let logo = this.add.image(650, 60, "logo").setScale(0.5);

    //display live
    this.liveText = this.add.text(30, 60, `Lives: ${this.lives}`, {
      color: "#fff",
      fontSize: "30px",
    });

    //display hint
    this.hintContainer = this.add
      .rectangle(650, 60, 200, 50, 0x000000)
      .setStrokeStyle(2, 0x00ff00, 1);

    this.hint = this.add
      .text(650, 60, this.selectedTrash.key, { fill: "#0f0", fontSize: "20px" })
      .setOrigin(0.5);

    //create trash
    this.trashGroup = this.physics.add.group();
    this.currentRecord["trash"] = this.selectedTrash;
    this.trash = this.spawnTrash(this.selectedTrash.key);

    //create bin
    this.binGroup = this.physics.add.staticGroup();
    this.binObjects = [];
    gameState.bins.forEach((bin, index) => {
      let binObject = this.spawnBin(150 + 250 * index, bin.key);
      this.binObjects[bin.key] = binObject;
    });
    console.log(this.binObjects);

    //display score
    this.scoreText = this.add.text(30, 30, `Score: ${this.score}`, {
      color: "#fff",
      fontSize: "30px",
    });

    //sorting rules
    this.physics.add.collider(
      this.trashGroup,
      this.binGroup,
      (trashObj, bin) => {
        {
          trashObj.destroy();
          this.currentRecord["sortedAt"] = Date.now();

          //right bin
          if (bin.texture.key === this.selectedTrash.type) {
            this.feedback(true, bin.texture.key);
          } /*wrong bin*/ else {
            this.feedback(false, bin.texture.key);
          }
          //save moves to record
          this.currentRecord["sortedAs"] = bin.texture.key;
          this.records.push(this.currentRecord);
          this.currentRecord = {};
          //console.log(this.records, "isPause:" + this.isGameLost);

          //create another trash
          this.selectedTrash = this.getRandomElement(gameState.trashes);
          this.currentRecord["trash"] = this.selectedTrash;
          this.trash = this.spawnTrash(this.selectedTrash.key);
        }
      }
    );
  }

  update() {
    //handle gameLost
    if (this.isGameLost) {
      this.lives = 3;
      this.scene.restart();
    }

    //keyboard controls
    if (this.cursors.left.isDown) {
      this.trash.x -= 10;
    }

    if (this.cursors.right.isDown) {
      this.trash.x += 10;
    }

    if (this.cursors.down.isDown) {
      this.trash.y += 10;
    }

    if (this.esc.isDown) {
      this.scene.stop("GameScene");
      this.scene.start("StartScene");
      /*
      this.physics.pause();
      this.isGamePaused = true;

      this.modalBg = this.add
        .rectangle(400, 300, 400, 300, 0x000000)
        .setStrokeStyle(2, 0x00ff00, 1);

      this.modalTitle = this.add
        .text(400, 300, "Press space again to quit", {
          fill: "#fff",
          fontSize: "24px",
        })
        .setOrigin(0.5, 0.5);*/
    }

    //losing game
    if (this.lives === 0) {
      //console.log("looping losing game");
      this.physics.pause();
      this.isGameLost = true;
      this.scene.pause();
      this.scene.launch("RecordScene", { records: this.records });
      //console.log("losing game logic pauses the game");
      /*this.add.text(50, 250, `Game over\nPress space to restart`, {
        color: "#fff",
        fontSize: "24px",
      });*/
      console.log(this.records);
      gameState.history.push(this.records);
    }
  }

  getRandomElement(arr) {
    const randomI = Math.floor(Math.random() * arr.length);
    return arr[randomI];
  }

  spawnTrash(key) {
    let trashObject = this.trashGroup
      .create(400, 0, key)
      .setScale(2)
      .setCollideWorldBounds(true);
    this.currentRecord["createdAt"] = Date.now();
    trashObject.setSize(trashObject.width, trashObject.height).setOffset(0, 0);
    this.hint.setText(key);
    return trashObject;
  }

  spawnBin(x, key) {
    let binObject = this.binGroup.create(x, 575, key);
    let binLabel = this.add
      .text(binObject.x, binObject.y, key, {
        fill: "#black",
        fontSize: "16px",
      })
      .setOrigin(0.5, 0.5);
    let binOutline = this.add
      .rectangle(binObject.x, binObject.y, binObject.width, binObject.height)
      .setStrokeStyle(4, 0x00ff00, 1)
      .setVisible(false);
    return { binObject, binLabel, binOutline };
  }

  feedback(isCorrect, key) {
    this.score += isCorrect
      ? gameState.scoring.reward.amount
      : gameState.scoring.deduction.amount;
    this.live -= isCorrect ? 0 : 1;
    !isCorrect && this.liveText.setText(`Lives: ${this.lives}`);
    this.scoreText.setText(`Score: ${this.score}`);
    let binOutline = this.binObjects[key].binOutline;
    let outlineColor = isCorrect ? 0x00ff00 : 0xff0000;
    binOutline.setStrokeStyle(5, outlineColor, 1).setVisible(true);
    setTimeout(() => binOutline.setVisible(false), 400);
  }
}
