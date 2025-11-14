class InputScene extends Phaser.Scene {
  constructor() {
    super({ key: "InputScene" });
  }

  init() {
    this.currentInputIndex = 0;
    this.inputTexts = [];
  }

  create() {
    //add container
    this.add
      .rectangle(400, 300, 500, 400, 0x000000)
      .setStrokeStyle(2, 0x00ff00, 1);

    //add guide
    let guide = "Please enter admin pin code and press return.";
    let guideStyle = { fontSize: "16px", fill: "#fff" };
    this.add.text(400, 450, guide, guideStyle).setOrigin(0.5);

    //add input place holder
    let inputStyle = { fontSize: "48px", fill: "#fff" };
    for (let i = 0; i < 4; i++) {
      let inputText = this.add.text(300 + i * 60, 250, "_", inputStyle);
      this.inputTexts.push(inputText);
    }

    this.input.keyboard.on("keydown", this.handleInput, this);
    this.escKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
  }

  update() {
    if (this.escKey.isDown) {
      this.scene.start("StartScene");
    }
  }

  handleInput(event) {
    //handle number input
    if (
      this.currentInputIndex < 4 &&
      event.keyCode >= 48 &&
      event.keyCode <= 57
    ) {
      let digit = event.key;
      this.inputTexts[this.currentInputIndex].setText(digit);
      this.currentInputIndex++;
    }

    //handle delete number
    if (event.keyCode === 8) {
      this.currentInputIndex -= 1;
      this.inputTexts[this.currentInputIndex].setText("_");
    }

    //hanlde return pin code
    if (this.currentInputIndex === 4 && event.keyCode === 13) {
      this.pinInput = this.inputTexts.map((text) => text.text).join("");

      let isPinCorrect = this.pinInput === "0000";

      this.inputTexts.forEach((text) =>
        text.setFill(isPinCorrect ? "#0f0" : "red")
      );

      if (isPinCorrect) {
        setTimeout(() => this.scene.start("ConfigScene"), 500);
      } else {
        this.cameras.main.shake(100, 0.005);
        setTimeout(() => {
          this.inputTexts.forEach((text) => text.setText("_").setFill("#fff"));
          this.currentInputIndex = 0;
        }, 200);
      }
    }
  }
}
