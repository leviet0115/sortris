class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init() {
    this.records = [];
    this.isLost = false;
    this.score = 0;
    this.lives = 3;
    this.currentRecord = {};
    this.selectedTrash = this.getRandomElement(gameState.trashes);
  }

  preload() {
    //load image for trash objects
    let trashFolder = "./resources/trashes/";
    for (let obj of gameState.trashes) {
      this.load.image(obj.key, trashFolder + obj.img);
    }

    //load image for bins
    gameState.bins.forEach((bin) => this.load.image(bin.key, bin.url));
  }

  create() {
    this.physics.world.setBounds(0, 0, 800, 600, true, true, true, true);

    //display live
    let liveStyle = { color: "#fff", fontSize: "30px" };
    this.liveText = this.add.text(30, 60, `Lives: ${this.lives}`, liveStyle);

    //display hint
    this.hintContainer = this.add
      .rectangle(650, 60, 200, 50, 0x000000)
      .setStrokeStyle(2, 0x00ff00, 1);

    let hintStyle = { fill: "#0f0", fontSize: "20px" };
    this.hint = this.add
      .text(650, 60, this.selectedTrash.key, hintStyle)
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
        trashObj.destroy();
        this.assessAndSave(bin.texture.key);
        this.selectedTrash = this.getRandomElement(gameState.trashes);
        this.currentRecord["trash"] = this.selectedTrash;
        this.trash = this.spawnTrash(this.selectedTrash.key);
      }
    );

    //add key object
    this.cursors = this.input.keyboard.createCursorKeys();
    this.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  update() {
    //handle restart
    if (this.isLost) {
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
    }

    //losing game
    if (this.lives === 0) {
      this.isLost = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("RecordScene", { records: this.records });
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
    this.lives -= isCorrect ? 0 : 1;
    !isCorrect && this.liveText.setText(`Lives: ${this.lives}`);
    this.scoreText.setText(`Score: ${this.score}`);
    let binOutline = this.binObjects[key].binOutline;
    let outlineColor = isCorrect ? 0x00ff00 : 0xff0000;
    binOutline.setStrokeStyle(5, outlineColor, 1).setVisible(true);
    setTimeout(() => binOutline.setVisible(false), 400);
  }

  assessAndSave(sortedType) {
    //save the move
    this.currentRecord["sortedAt"] = Date.now();
    this.currentRecord["sortedAs"] = sortedType;
    this.records.push(this.currentRecord);
    this.currentRecord = {};

    //assess the move
    if (sortedType === this.selectedTrash.type) {
      this.feedback(true, sortedType);
    } else {
      this.feedback(false, sortedType);
    }
  }
}
