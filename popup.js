(function () {
  window.onload = function () {
    document.getElementById("name").addEventListener("keyup", function (e) {
      document.getElementById("greet").innerHTML = `Hello ${e.target.value}`;
    });
  };
})();
