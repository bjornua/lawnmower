define(["vector", "game", "immutable"], function (Vector, Game, Immutable) {
    "use strict";
    var bfs = function (pos) {
        var routes = Immutable.List([[pos]]);

        routes.map(getPerimeter);
        console.log(String(routes));
    };
});