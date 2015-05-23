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

    var mapTiles = function(centerPos, game) {
        Tools.bfs(centerPos, game.area).forEach(function(startTile) {
            Tools.bfs(startTile.pos, game.area).takeWhile(function(res) {
                return true;
            }).forEach(function (res) {
                game = updateScore(game, res.pos, res.dist);
            });
        });
        return game;
    };

    var getPath = function () {

    };

    return function (game) {
        if (game.getState("initialized") !== true) {
            Tools.bfs(Vector(0, 0), game.area).forEach(function (res) {
                game = game.setNumber(res.pos, undefined);
            });
            game = mapTiles(game.pos, game);
            game = game.setState("initialized", true);
        } else {
            game = game.moveForward();
        }
        return game;
    };
});
