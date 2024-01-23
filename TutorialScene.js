class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: "TutorialScene" });
    this.title = "How to play";
    this.goal = "Goal: put trash to the right bin";
    this.keyDescription = [
      { keyName: "Left", description: "Move the trash to left" },
      { keyName: "Right", description: "Move the trash to right" },
      { keyName: "Down", description: "Move the trash down faster" },
      { keyName: "Esc", description: "Back to main menu" },
    ];
  }

  create() {
    this.background = this.add
      .rectangle(400, 300, 500, 400, 0x000000)
      .setStrokeStyle(2, 0x00ff00, 1);

    const titleText = this.add
      .text(400, 220, this.title, {
        fill: "#fff",
        fontSize: "32px",
      })
      .setOrigin(0.5);

    const goalText = this.add
      .text(400, 260, this.goal, {
        fill: "#fff",
        fontSize: "16px",
        //wordWrap: { width: 300 },
      })
      .setOrigin(0.5);

    this.keyDescription.forEach((item, index) => {
      let keyText = this.add.text(
        230,
        goalText.y + 10 + 30 * (index + 1),
        item.keyName,
        {
          fill: "#00ff00",
          fontSize: "16px",
        }
      );

      let descriptionText = this.add
        .text(300, keyText.y, item.description, {
          fill: "white",
          fontSize: "16px",
        })
        .setOrigin(0);
    });

    this.escKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
  }

  update() {
    if (this.escKey.isDown) {
      this.scene.stop("TutorialScene");
      this.scene.resume("StartScene");
    }
  }
}
