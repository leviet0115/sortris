class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });

    this.menuItems = ["Start Game", "Options", "How to play"];
    this.selectedItemIndex = 0;
    this.menuTexts = [];
  }

  preload() {
    this.load.image("logo", "./resources/logo.png");
  }

  create() {
    // Display menu items
    this.logo = this.add.image(400, 200, "logo");
    this.menuItems.forEach((item, index) => {
      const text = this.add
        .text(400, this.logo.y + 100 + index * 40, item, {
          fontSize: "24px",
          fill: index === this.selectedItemIndex ? "#0f0" : "#fff",
          padding: {
            left: 10,
            right: 10,
            top: 5,
            bottom: 5,
          },
        })
        .setOrigin(0.5);
      this.menuTexts.push(text);
    });
    this.add
      .text(
        400,
        550,
        "Keyboard-only: use \u2190, \u2191, \u2192, \u2193, space, esc",
        { fontSize: "20px" }
      )
      .setOrigin(0.5);
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();

    //if press down, the cursor move to a lower option
    if (cursors.down.isDown && !this.downKeyIsPressed) {
      this.selectedItemIndex =
        (this.selectedItemIndex + 1) % this.menuItems.length;
      console.log("pressing down", this.selectedItemIndex);
      this.downKeyIsPressed = true;
      this.updateMenu();
    }

    //if press up, the cursor move to an upper option
    if (cursors.up.isDown && !this.upKeyIsPressed) {
      this.selectedItemIndex =
        (this.selectedItemIndex - 1 + this.menuItems.length) %
        this.menuItems.length;
      console.log("pressing up", this.selectedItemIndex);
      this.upKeyIsPressed = true;
      this.updateMenu();
    }

    //if press space, trigger the relevant event
    if (cursors.space.isDown && !this.spaceKeyIsPressed) {
      this.spaceKeyIsPressed = true;
      this.selectedItemIndex === 0 && this.scene.start("GameScene");
      this.selectedItemIndex === 2 &&
        this.scene.pause("StartScene") &&
        this.scene.launch("TutorialScene");
    }

    //reset press flags
    if (cursors.down.isUp) {
      this.downKeyIsPressed = false;
    }

    if (cursors.up.isUp) {
      this.upKeyIsPressed = false;
    }

    if (cursors.space.isUp) {
      this.spaceKeyIsPressed = false;
    }
  }

  updateMenu() {
    this.menuTexts.forEach((text, index) => {
      text.setFill(index === this.selectedItemIndex ? "#0f0" : "#fff");
    });
  }
}
