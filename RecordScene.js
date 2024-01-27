class RecordScene extends Phaser.Scene {
  constructor() {
    super({ key: "RecordScene" });
  }

  preload() {
    const trashFolder = "./resources/trashes/";
    gameState.history[0].forEach((record) =>
      this.load.image(record.trash.key, trashFolder + record.trash.img)
    );
  }

  create() {
    let background = this.add
      .rectangle(400, 300, 500, 400, 0x000000)
      .setStrokeStyle(2, 0x00ff00, 1);

    const textStyle = { font: "16px Arial" };
    const records = gameState.history[0];

    const playTime = records.reduce((totalTime, record) => {
      return totalTime + (record.sortedAt - record.createdAt) / 1000;
    }, 0);

    let totalScore = 0;

    let currentPage = 1;

    //listing score
    records.forEach((record, index) => {
      // add trash image to the left
      let trash = this.add.image(220, 220 + 32 * index, record.trash.key);

      //extract score
      let score =
        record.sortedAs === record.trash.type
          ? `+${gameState.scoring.reward.amount}`
          : gameState.scoring.deduction.amount;

      totalScore += Number(score);

      let fill = score > 0 ? "#0f0" : "#B0B0B0";

      // add correct category next to trash
      let cat = this.add
        .text(trash.x + trash.width, trash.y, `(${record.trash.type})`, {
          ...textStyle,
          fill,
        })
        .setOrigin(0, 0.5);

      // add score to the right
      let scoreText = this.add
        .text(background.width, trash.y, score, {
          ...textStyle,
          fill,
        })
        .setOrigin(0, 0.5);
      scoreText.setX(650 - scoreText.width - 70);

      //filling dots between image and text
      let lastLeft = cat;
      let numberOfDots = (scoreText.x - lastLeft.x - lastLeft.width) / 9 - 4;
      let dots = "";
      for (let i = 0; i < numberOfDots; i++) {
        dots += ". ";
      }
      let dotsDivider = this.add
        .text(lastLeft.width + lastLeft.x + 18, lastLeft.y, dots, textStyle)
        .setOrigin(0, 0.5);
    });

    let totalScoreText = this.add.text(
      200,
      150,
      `You practiced waste sorting for ${playTime} seconds \nand earned ${totalScore} points.`,
      textStyle
    );
  }
}
