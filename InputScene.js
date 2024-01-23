class InputScene extends Phaser.Scene {
  constructor() {
    super({ key: "InputScene" });
  }

  create() {
    this.inputTexts = [];
    for (let i = 0; i < 4; i++) {
      let inputText = this.add
        .text(150 + i * 60, 200, "_", {
          font: "48px Arial",
          fill: "#FFFFFF",
        })
        .setInteractive();

      this.inputTexts.push(inputText);
    }

    this.currentInputIndex = 0;
    this.input.keyboard.on("keydown", this.handleInput, this);
  }

  handleInput(event) {
    if (
      this.currentInputIndex < 4 &&
      event.keyCode >= 48 &&
      event.keyCode <= 57
    ) {
      let digit = event.key;
      this.inputTexts[this.currentInputIndex].setText(digit);
      this.currentInputIndex++;
    }

    if (this.currentInputIndex === 4 && event.keyCode === 13) {
      console.log("Submitted pin");
      this.pinInput = this.inputTexts.map((text) => text.text).join("");
      console.log(this.pinInput);
      let isPinCorrect = this.pinInput === "0000";

      this.inputTexts.forEach((text) =>
        text.setFill(isPinCorrect ? "#0f0" : "red")
      );
      if (isPinCorrect) {
        this.scene.start("GameScene");
      } else {
        this.cameras.main.shake(100, 0.01);
        setTimeout(() => {
          this.inputTexts.forEach((text) => text.setText("_").setFill("#fff"));
          this.currentInputIndex = 0;
        }, 200);
      }
    }
  }
}
