class RecordScene extends Phaser.Scene {
  constructor() {
    super({ key: "RecordScene" });
  }

  init(data) {
    this.records = data.records;
    //paging
    this.pages = [];
    this.currentPage = 0;
    this.maxPageLength = 6;
  }

  preload() {
    const trashFolder = "./resources/trashes/";
    this.records.forEach((record) =>
      this.load.image(record.trash.key, trashFolder + record.trash.img)
    );
  }

  create() {
    let background = this.add
      .rectangle(400, 300, 500, 400, 0x000000)
      .setStrokeStyle(2, 0x00ff00, 1);

    const textStyle = { font: "16px Arial" };

    let totalScore = 0;

    //render all pages
    for (let i = 0; i < this.records.length; i += this.maxPageLength) {
      let page = this.records.slice(i, i + this.maxPageLength);
      let trashImages = [];
      let catTexts = [];
      let scoreTexts = [];
      let dotsDividers = [];

      page.forEach((record, index) => {
        let trash = this.add.image(220, 220 + 32 * index, record.trash.key);
        trashImages.push(trash);

        //extract score
        let score =
          record.sortedAs === record.trash.type
            ? `+${gameState.scoring.reward.amount}`
            : gameState.scoring.deduction.amount;

        totalScore += Number(score);

        let recordStyle = {
          ...textStyle,
          fill: score > 0 ? "#0f0" : "#B0B0B0",
        };

        // add correct category next to trash
        let cat = this.add
          .text(
            trash.x + trash.width,
            trash.y,
            `is ${record.trash.type}`,
            recordStyle
          )
          .setOrigin(0, 0.5);
        catTexts.push(cat);

        // add score to the right
        let scoreText = this.add
          .text(background.width, trash.y, score, recordStyle)
          .setOrigin(0, 0.5);
        scoreText.setX(650 - scoreText.width - 70);
        scoreTexts.push(scoreText);

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
        dotsDividers.push(dotsDivider);
      });

      let pageTexts = { trashImages, catTexts, scoreTexts, dotsDividers };
      this.pages.push(pageTexts);
    }

    const playTime = this.records.reduce((totalTime, record) => {
      return totalTime + (record.sortedAt - record.createdAt) / 1000;
    }, 0);

    //display summary
    let summary = `You practiced waste sorting for ${playTime.toFixed(
      2
    )} seconds \nand earned ${totalScore} points.`;
    this.add.text(200, 150, summary, textStyle);

    //display guide
    let guide = `Press space to restart`;
    this.add.text(200, 450, guide);

    //display page number
    this.pageNumber = `\u2190 Page ${this.currentPage + 1}/${
      this.pages.length
    } \u2192`;
    this.footer = this.add.text(background.width, 450, this.pageNumber);

    //display current page only
    this.changePage(this.currentPage);

    //add key object
    this.cursors = this.input.keyboard.createCursorKeys();
    this.escKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
  }

  update() {
    //handle right click +1 page
    if (this.cursors.right.isDown && !this.rightKeyIsPressed) {
      this.rightKeyIsPressed = true;
      this.changePage(1);
    }

    if (this.cursors.left.isDown && !this.leftKeyIsPressed) {
      this.leftKeyIsPressed = true;
      this.changePage(-1);
    }

    if (this.cursors.space.isDown && !this.spaceKeyIsPressed) {
      this.spaceKeyIsPressed = true;
      this.scene.stop();
      this.scene.resume("GameScene");
    }

    if (this.escKey.isDown) {
      this.scene.stop("RecordScene");
      this.scene.stop("GameScene");
      this.scene.start("StartScene");
    }

    //reset flag
    if (this.cursors.right.isUp) {
      this.rightKeyIsPressed = false;
    }

    if (this.cursors.left.isUp) {
      this.leftKeyIsPressed = false;
    }

    if (this.cursors.space.isUp) {
      this.spaceKeyIsPressed = false;
    }
  }

  setPageVisibility(page, visibility) {
    Object.values(page).forEach((pageTexts) => {
      pageTexts.forEach((text) => {
        text.setVisible(visibility);
      });
    });
  }

  changePage(direction) {
    this.currentPage += direction;
    this.currentPage = Phaser.Math.Clamp(
      this.currentPage,
      0,
      this.pages.length - 1
    );

    this.footer.setText(this.pageNumber);

    this.pages.forEach((page, index) => {
      let pageVisibility = index === this.currentPage ? true : false;
      this.setPageVisibility(page, pageVisibility);
    });
  }
}
