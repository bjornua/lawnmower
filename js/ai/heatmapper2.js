define(["vector", "immutable", "ai/tools2"], function (Vector, Immutable, Tools) {
    "use strict";

    var updateScore = function (game, pos, dist) {
        var tile = game.getTile(pos);
        var score = tile.get("number");
        if (score === undefined) {
            score = 0;
        }
        score = score + (1 / (dist + 1));
        tile = tile.set("number", score);
        game = game.setTile(tile);

        return game;

    };

    var mapTiles = function(game) {
        game.area.tiles.forEach(function(initialTile) {
            Tools.bfs(initialTile.pos, game.area).takeWhile(function(res) {
                return res.dist < 4;
            }).forEach(function (res) {
                game = updateScore(game, res.pos, res.dist);
            });
        });
        return game;
    };

    return function (game) {

        return mapTiles(game);

        // tiles.forEach(function (tile) {
        //     game = game.setTile(tile);
        // });


        // return game;
    };
});
