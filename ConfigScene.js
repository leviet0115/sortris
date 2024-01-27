class ConfigScene extends Phaser.Scene {
  constructor() {
    super({ key: "ConfigScene" });
  }

  init() {
    this.configItems = [];
    this.selectedItemIndex = 0;
  }

  create() {
    this.background = this.add
      .rectangle(400, 300, 500, 400, 0x000000)
      .setStrokeStyle(2, 0x00ff00, 1);

    Object.values(gameState.scoring).forEach((logic, index) => {
      let logicText = this.add
        .text(
          400,
          250 + 30 * (index + 1),
          `${logic.description}: ${logic.amount}`,
          {
            fontSize: "20px",
            fill: index === this.selectedItemIndex ? "#0F0" : "#FFFFFF",
          }
        )
        .setOrigin(0.5);

      this.configItems.push(logicText);
    });

    this.selectedItemIndex = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.escKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );

    this.consoleDiv = document.getElementById("console");
    this.consoleInput = document.getElementById("inputField");
    document
      .getElementById("cancelBtn")
      .addEventListener(
        "click",
        () => (this.consoleDiv.style.display = "none")
      );

    document.getElementById("submitBtn").addEventListener("click", () => {
      console.log(this.consoleInput.value);
      this.consoleDiv.style.display = "none";
      this.validatedUpdate(
        this.selectedItemIndex === 0 ? "reward" : "deduction",
        this.consoleInput.value
      );
    });
  }

  update() {
    //if press down, the cursor move to a lower option
    if (this.cursors.down.isDown && !this.downKeyIsPressed) {
      this.selectedItemIndex =
        (this.selectedItemIndex + 1) % this.configItems.length;
      this.downKeyIsPressed = true;
      this.updateMenu();
    }

    //if press up, the cursor move to an upper option
    if (this.cursors.up.isDown && !this.upKeyIsPressed) {
      this.selectedItemIndex =
        (this.selectedItemIndex - 1 + this.configItems.length) %
        this.configItems.length;
      this.upKeyIsPressed = true;
      this.updateMenu();
    }

    //if press space, trigger the relevant event
    if (this.cursors.space.isDown && !this.spaceKeyIsPressed) {
      this.spaceKeyIsPressed = true;
      console.log("space press");
      //let input = window.prompt(`How do you want to change?`);
      this.consoleDiv.style.display = "block";
      document.getElementById("inputField").focus();
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

    if (this.escKey.isDown) {
      this.scene.stop("ConfigScene");
      this.scene.start("StartScene");
    }
  }

  updateMenu() {
    this.configItems.forEach((text, index) => {
      text.setFill(index === this.selectedItemIndex ? "#0f0" : "#fff");
    });
  }

  isInputValid(logicKey, input) {
    if (!isNaN(input) && Number.isInteger(input)) {
      if (logicKey === "reward" && input > 0) return true;
      if (logicKey === "deduction" && input <= 0) return true;
    }

    return false;
  }

  validatedUpdate(logicKey, input) {
    let amount = Number(input);
    console.log(logicKey, amount, this.isInputValid(logicKey, amount));
    if (this.isInputValid(logicKey, amount)) {
      gameState.scoring[logicKey].amount = amount;
      let logic = gameState.scoring[logicKey];
      this.configItems[this.selectedItemIndex].setText(
        `${logic.description}: ${logic.amount}`
      );
      this.consoleInput.value = "";
    } else {
      let error = this.add
        .text(400, 550, "Invalid input!", { fill: "red", fontSize: "20px" })
        .setOrigin(0.5);
      this.cameras.main.shake(100, 0.005);
      setTimeout(() => error.destroy(), 800);
      this.consoleInput.value = "";
    }
  }
}
