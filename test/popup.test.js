global.$ = require("jquery");
require("../popup.js");

test("test greeting message without input", () => {
  document.body.innerHTML = `
    <h2 id="greet">Hello!</h2>
    <input type="text" id="name" />
  `;

  expect($("#greet").html()).toEqual("Hello!");
});
