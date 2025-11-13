class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  init() {
    this.menuItems = [
      { desc: "Start Game", sceneKey: "GameScene", isOverlayed: false },
      {
        desc: "How to play",
        sceneKey: "TutorialScene",
        isOverlayed: true,
      },
      {
        desc: "Configuration",
        sceneKey: "InputScene",
        isOverlayed: false,
      },
    ];
    this.selectedItemIndex = 0;
    this.menuTexts = [];
  }

  preload() {
    this.load.image("logo", "./resources/logo.png");
  }

  create() {
    this.logo = this.add.image(400, 200, "logo");

    //add menu items
    this.menuItems.forEach((item, index) => {
      const text = this.add
        .text(400, this.logo.y + 100 + index * 40, item.desc, {
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

    //add footer
    this.add
      .text(
        400,
        550,
        "Keyboard-only: use \u2190, \u2191, \u2192, \u2193, space, esc",
        { fontSize: "20px" }
      )
      .setOrigin(0.5);

    //add cursor object for
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    //if press down, the cursor move to a lower option
    if (this.cursors.down.isDown && !this.downKeyIsPressed) {
      this.downKeyIsPressed = true;
      this.selectedItemIndex =
        (this.selectedItemIndex + 1) % this.menuItems.length;
      //console.log("pressing down", this.selectedItemIndex);
      this.updateMenu();
    }

    //if press up, the cursor move to an upper option
    if (this.cursors.up.isDown && !this.upKeyIsPressed) {
      this.upKeyIsPressed = true;
      this.selectedItemIndex =
        (this.selectedItemIndex - 1 + this.menuItems.length) %
        this.menuItems.length;
      //console.log("pressing up", this.selectedItemIndex);
      this.updateMenu();
    }

    //if press space, trigger the relevant event
    if (this.cursors.space.isDown && !this.spaceKeyIsPressed) {
      this.spaceKeyIsPressed = true;
      let selectedItem = this.menuItems[this.selectedItemIndex];
      if (selectedItem.isOverlayed === true) {
        this.scene.pause("StartScene");
        this.scene.launch(selectedItem.sceneKey);
      } else {
        this.scene.start(selectedItem.sceneKey);
      }
    }

    //reset press flags
    if (this.cursors.down.isUp) {
      this.downKeyIsPressed = false;
    }

    if (this.cursors.up.isUp) {
      this.upKeyIsPressed = false;
    }

    if (this.cursors.space.isUp) {
      this.spaceKeyIsPressed = false;
    }
  }

  updateMenu() {
    this.menuTexts.forEach((text, index) => {
      //console.log(text.text, this.selectedItemIndex);
      text.setFill(index === this.selectedItemIndex ? "#0f0" : "#fff");
    });
  }
}

/* 
used Phaser 3 methods
  this.load.image
  this.add.image
  this.add.text
  this.input.keyboard.createCursorKeys()

used Phaser 3 objects
  image 
  text
  cursorKeys  
  */