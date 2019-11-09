"use strict";

var continents = ['Africa', 'America', 'Asia', 'Australia', 'Europe'];
var helloContinents = Array.from(continents, function (c) {
  return "Hello ".concat(c, "!");
});
var message = helloContinents.join(' ');
var element = React.createElement("div", {
  title: "Outer div"
}, React.createElement("h1", {
  className: "class_h1"
}, message));
ReactDOM.render(element, document.getElementById('content'));