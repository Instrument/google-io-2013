function setUpPage() {
  setUpPageStatus = 'complete';
  app = new ww.app.Core();
}

// function tearDown() {
// }

// var savedFunctions = {};
// function setUp() {
//   for (var key in mode.constructor.prototype) {
//     if (mode.constructor.prototype.hasOwnProperty(key)) {
//       savedFunctions[key] = mode.constructor.prototype[key];
//     }
//   }
// }

// function tearDown() {
//   for (var key in savedFunctions) {
//     if (savedFunctions.hasOwnProperty(key)) {
//       mode.constructor.prototype[key] = savedFunctions[key];
//     }
//   }
// }

function testInitialLoad() {
  assertEquals('Should default to home mode', 'home', app.currentMode.name);
}

function testContainerResizing() {
  app.onResize_();
}