define(["vector", "immutable", "ai/tools2"], function (Vector, Immutable, Tools) {
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

    var mapTiles = function(area) {
        area.tiles.map(function(tile) {
            score = bfs(area).
            tile.set("number", score);
        });
        var tiles = Immutable.List();

        return tiles;
    };


    return function (game) {
        var tiles = mapTiles(game.area);

        tiles.forEach(function (tile) {
            game = game.setTile(tile);
        });


        return game;
    };
});
