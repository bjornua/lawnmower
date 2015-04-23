require(
    ["3rdparty/react"], function (React) {
    "use strict";


    var Main = React.createClass({
        displayName: "main",
        render: function () {
            return React.createElement("h1", {}, "Hello world");
        }
    });

    var element = React.createElement(Main);

    React.render(element, window.document.getElementById("main"));
});
