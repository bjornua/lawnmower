define(["react", "view"], function (React, Main) {
    "use strict";

    var element = React.createElement(Main);

    React.render(element, window.document.getElementById("main"));

});
