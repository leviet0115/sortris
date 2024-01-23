class InputScene extends Phaser.Scene {
  constructor() {
    super({ key: "InputScene" });
  }

  create() {
    this.background = this.add
      .rectangle(400, 300, 500, 400, 0x000000)
      .setStrokeStyle(2, 0x00ff00, 1);

    this.title = this.add
      .text(400, 450, "Please enter admin pin code and press return.")
      .setOrigin(0.5);

    this.inputTexts = [];
    for (let i = 0; i < 4; i++) {
      let inputText = this.add
        .text(300 + i * 60, 250, "_", {
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
      this.inputTexts[this.currentInputIndex - 1].setText("_");
      this.currentInputIndex -= 1;
    }

    //hanlde return pin code
    if (this.currentInputIndex === 4 && event.keyCode === 13) {
      //console.log("Submitted pin");
      this.pinInput = this.inputTexts.map((text) => text.text).join("");
      //console.log(this.pinInput);
      this.isPinCorrect = this.pinInput === "0000";

      this.inputTexts.forEach((text) =>
        text.setFill(this.isPinCorrect ? "#0f0" : "red")
      );
      if (this.isPinCorrect) {
        // setTimeout(() => this.scene.start("GameScene"), 500);
        let userInput = prompt("Please enter your input:");
        console.log("You entered:", userInput);
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
