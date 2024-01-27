var config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 800,
  height: 600,
  scene: [StartScene, GameScene, TutorialScene, InputScene, ConfigScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
};

const game = new Phaser.Game(config);

const gameState = {};

gameState.bin = [
  {
    type: "organic",
    color: "green",
  },
  {
    type: "recyclable",
    color: "orange",
  },
  { type: "other", color: "red" },
];

gameState.scoring = {
  reward: {
    description: "Reward per correct answer",
    amount: 50,
  },
  deduction: {
    description: "Deduction per incorrect answer",
    amount: -25,
  },
};

gameState.history = [];

gameState.trashes = [
  {
    key: "american-cheese",
    img: "American_cheese_p.png",
    type: "organic",
  },
  {
    key: "aluminum-foild",
    img: "aluminum_foil.png",
    type: "recyclable",
  },
  {
    key: "bacon",
    img: "bacon.png",
    type: "organic",
  },
  {
    key: "baking-powder",
    img: "baking_powder.png",
    type: "recyclable",
  },
  {
    key: "ball-pen",
    img: "ball_pen.png",
    type: "recyclable",
  },
  {
    key: "banana",
    img: "banana.png",
    type: "organic",
  },
  {
    key: "bandage-box",
    img: "bandage_box.png",
    type: "recyclable",
  },
  {
    key: "bbq-sauce",
    img: "barbeque_sauce.png",
    type: "recyclable",
  },
  {
    key: "basket-metal",
    img: "basket_metal.png",
    type: "recyclable",
  },
  {
    key: "basket-yellow",
    img: "basket_yellow.png",
    type: "recyclable",
  },
  {
    key: "cheese-white",
    img: "white_cheese_p.png",
    type: "organic",
  },
];
