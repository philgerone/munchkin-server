let index = 0;
const createArray = (size) => {
  return Array.from(Array(size).keys());
};
createArray(5); /* ? */
const piecesOr = createArray(11).map((card) => ({
  index: index++,
  name: "Pièce d'or",
  value: 0.5
}));
const squelette = {
  index: index++,
  name: "squelette",
  value: 1
};
const cailloux = createArray(4).map((card) => ({
  index: index++,
  type: "Cailloux",
  value: 0
}));
const pierresPrecieuses = () => createArray(7).map((card, idx) => ({
  index: index++,
  name: "Pierre précieuse",
  value: idx + 1
}));

const cards = [
  ...piecesOr,
  ...cailloux,
  ...pierresPrecieuses(),
  ...pierresPrecieuses(),
  ...pierresPrecieuses(),
  ...pierresPrecieuses(),
  squelette
];

module.exports = cards;