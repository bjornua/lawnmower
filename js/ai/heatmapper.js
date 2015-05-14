define(["vector", "immutable", "ai/tools"], function (Vector, Immutable, Tools) {
    "use strict";


    var setNumbers = function (area, positions, value) {
        return positions.map(function (pos) {
            return area.getTile(pos).set("number", value);
        });
    };

    var count = function(pos, area) {
        var score = 0;

        var multiplier = 1.0;
        var i = 0;
        Tools.bfs(pos, area, function (ends) {
            score = ends.reduce(function (s, end) {
                return s + multiplier;
            }, score);
            multiplier /= 4;
            return true;
        });

        return score;
    };

    var mapTiles = function(initialPos, area) {
        var tiles = Immutable.List();
        var i = 0;
        Tools.bfs(initialPos, area, function (ends) {
            tiles = tiles.concat(ends.map(function (pos) {
                var score = count(pos, area);
                return area.getTile(pos).set("number", score);
            }));
            return true;
        });
        return tiles;
    };


    return function (game) {
        var tiles = mapTiles(Vector(0, 0), game.area);

        tiles.forEach(function (tile) {
            game = game.setTile(tile);
        });


        return game;
    };
});
