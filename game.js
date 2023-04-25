var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
};

const game = new Phaser.Game(config);

const gameState = {};

gameState.trashes = [
  {
    key: "american-cheese",
    img: "American_cheese_p.png",
    type: "green",
  },
  {
    key: "aluminum-foild",
    img: "aluminum_foil.png",
    type: "orange",
  },
  {
    key: "bacon",
    img: "bacon.png",
    type: "green",
  },
  {
    key: "baking-powder",
    img: "baking_powder.png",
    type: "orange",
  },
  {
    key: "ball-pen",
    img: "ball_pen.png",
    type: "orange",
  },
  {
    key: "banana",
    img: "banana.png",
    type: "green",
  },
  {
    key: "bandage-box",
    img: "bandage_box.png",
    type: "orange",
  },
  {
    key: "bbq-sauce",
    img: "barbeque_sauce.png",
    type: "orange",
  },
  {
    key: "basket-metal",
    img: "basket_metal.png",
    type: "orange",
  },
  {
    key: "basket-yellow",
    img: "basket_yellow.png",
    type: "orange",
  },
  {
    key: "cheese-white",
    img: "white_cheese_p.png",
    type: "green",
  },
];

function preload() {
  const trashFolder = "./resources/trashes/";
  for (let obj of gameState.trashes) {
    this.load.image(obj.key, trashFolder + obj.img);
  }
  this.load.image("red", "./resources/bins/red-bin.png");
  this.load.image("green", "./resources/bins/green-bin.png");
  this.load.image("orange", "./resources/bins/orange-bin.png");
}

function create() {
  //create trash
  const trash = this.physics.add.group();
  gameState.selectedTrash = getRandomElement(gameState.trashes);
  gameState.trash = trash
    .create(400, 0, gameState.selectedTrash.key)
    .setScale(2);

  //create bin
  const bins = this.physics.add.staticGroup();
  bins.create(150, 575, "red");
  bins.create(150 + 250, 575, "green");
  bins.create(150 + 250 * 2, 575, "orange");

  //create score text
  gameState.score = 0;
  gameState.displayScore = this.add.text(30, 30, "Score: 0", {
    color: "#fff",
    fontSize: "30px",
  });

  //create live
  gameState.lives = 3;
  gameState.displayLives = this.add.text(30, 60, "Lives: 3", {
    color: "#fff",
    fontSize: "30px",
  });

  //create records holder
  gameState.records = [];

  //sorting rules
  this.physics.add.collider(trash, bins, function (trashObj, bin) {
    {
      trashObj.destroy();

      //right bin
      if (bin.texture.key === gameState.selectedTrash.type) {
        gameState.score += 50;
        gameState.displayScore.setText(`Score: ${gameState.score}`);
      } /*wrong bin*/ else {
        gameState.score -= 20;
        gameState.displayScore.setText(`Score: ${gameState.score}`);
        gameState.lives -= 1;
        gameState.displayLives.setText(`Lives: ${gameState.lives}`);
      }
      //save moves to record
      const record = {
        selectedTrash: gameState.selectedTrash,
        sortedAs: bin.texture.key,
      };
      gameState.records = [...gameState.records, record];
      console.log(gameState.records);

      //create another trash
      gameState.selectedTrash = getRandomElement(gameState.trashes);
      gameState.trash = trash
        .create(400, 0, gameState.selectedTrash.key)
        .setScale(2);
    }
  });
}

function update() {
  //trash controls
  const cursors = this.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    gameState.trash.x -= 10;
  }
  if (cursors.right.isDown) {
    gameState.trash.x += 10;
  }
  if (cursors.down.isDown) {
    gameState.trash.y += 10;
  }

  if (cursors.space.isDown) {
    this.scene.restart();
  }

  //losing game
  if (gameState.lives === 0) {
    this.physics.pause();
    /*
    this.add.text(50, 250, `Game over\nPress space to restart`, {
      color: "#fff",
      fontSize: "30px",
    });*/
  }
}

function getRandomElement(arr) {
  const randomI = Math.floor(Math.random() * arr.length);
  return arr[randomI];
}
