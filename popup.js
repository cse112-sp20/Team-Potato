(function () {
  window.onload = function () {
    $("#name").on("keyup", function (e) {
      $("#greet").html(`Hello ${e.target.value}`);
    });
  };
})();
