// Images
export const logo = require("./EGLogo.png");

// SVG
export const W = require("./colors/W.svg").default;
export const U = require("./colors/U.svg").default;
export const B = require("./colors/B.svg").default;
export const R = require("./colors/R.svg").default;
export const G = require("./colors/G.svg").default;
export const C = require("./colors/C.svg").default;
// Safeguard against invalid inputs; also used to create each button
export const validColors = ["W", "U", "B", "R", "G", "C"];
// Used to help the map function display each image
export const colorImages = { W, U, B, R, G, C };

export const deckIcon = require("./deckIcon.svg").default;
export const bracketIcon = require("./bracketIcon.svg").default;
