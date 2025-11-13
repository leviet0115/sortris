var config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 800,
  height: 600,
  scene: [
    StartScene,
    RecordScene,
    GameScene,
    TutorialScene,
    InputScene,
    ConfigScene,
  ],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      //  debug: true,
    },
  },
};

const game = new Phaser.Game(config);

const gameState = {};

gameState.bins = [
  {
    key: "organic",
    url: "./resources/bins/green-bin.png",
    displayAs: "Organic",
  },
  {
    key: "recyclable",
    url: "./resources/bins/orange-bin.png",
    displayAs: "Recyclable",
  },
  { key: "others", url: "./resources/bins/red-bin.png", displayAs: "Others" },
];

gameState.scoring = {
  reward: {
    description: "Reward per correct answer",
    amount: 50,
  },
  deduction: {
    description: "Deduction per wrong answer",
    amount: -25,
  },
};

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

gameState.history = [];

/*
gameState.history = [
  [
    {
      trash: {
        key: "aluminum-foil",
        img: "aluminum_foil.png",
        type: "recyclable",
      },
      createdAt: 1706378510615,
      sortedAt: 1706378512613,
      sortedAs: "other",
    },
    {
      trash: {
        key: "ball-pen",
        img: "ball_pen.png",
        type: "recyclable",
      },
      createdAt: 1706378512614,
      sortedAt: 1706378514475,
      sortedAs: "recyclable",
    },
    {
      trash: {
        key: "bandage-box",
        img: "bandage_box.png",
        type: "recyclable",
      },
      createdAt: 1706378514476,
      sortedAt: 1706378516342,
      sortedAs: "recyclable",
    },
    {
      trash: {
        key: "aluminum-foild",
        img: "aluminum_foil.png",
        type: "recyclable",
      },
      createdAt: 1706378516344,
      sortedAt: 1706378518411,
      sortedAs: "recyclable",
    },
    {
      trash: {
        key: "aluminum-foil",
        img: "aluminum_foil.png",
        type: "recyclable",
      },
      createdAt: 1706378510615,
      sortedAt: 1706378512613,
      sortedAs: "other",
    },
    {
      trash: {
        key: "ball-pen",
        img: "ball_pen.png",
        type: "recyclable",
      },
      createdAt: 1706378512614,
      sortedAt: 1706378514475,
      sortedAs: "recyclable",
    },
    {
      trash: {
        key: "bandage-box",
        img: "bandage_box.png",
        type: "recyclable",
      },
      createdAt: 1706378514476,
      sortedAt: 1706378516342,
      sortedAs: "recyclable",
    },
    {
      trash: {
        key: "aluminum-foild",
        img: "aluminum_foil.png",
        type: "recyclable",
      },
      createdAt: 1706378516344,
      sortedAt: 1706378518411,
      sortedAs: "recyclable",
    },
    {
      trash: {
        key: "aluminum-foil",
        img: "aluminum_foil.png",
        type: "recyclable",
      },
      createdAt: 1706378510615,
      sortedAt: 1706378512613,
      sortedAs: "other",
    },
    {
      trash: {
        key: "ball-pen",
        img: "ball_pen.png",
        type: "recyclable",
      },
      createdAt: 1706378512614,
      sortedAt: 1706378514475,
      sortedAs: "recyclable",
    },
    {
      trash: {
        key: "bandage-box",
        img: "bandage_box.png",
        type: "recyclable",
      },
      createdAt: 1706378514476,
      sortedAt: 1706378516342,
      sortedAs: "recyclable",
    },
  ],
];
*/
