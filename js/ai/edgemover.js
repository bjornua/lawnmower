define(["vector", "game/tile", "immutable", "ai/tools"], function (Vector, Tile, Immutable, Tools) {
    "use strict";
    var getDir = function (vec) {
        if (vec.y === 1) {
            return 1;
        }
        if (vec.y === -1) {
            return 3;
        }
        if (vec.x === 1) {
            return 0;
        }
        return 2;
    };

    var edgeMover = function (game) {
        var next = Tools.getAdjacent(game.pos, game.area).minBy(function (pos) {
            var perimeter = Tools.getAdjacent(pos, game.area);
            var dir = getDir(pos.subtract(game.pos));
            return perimeter.size - (game.dir === dir ? 0.5 : 0);
        });
        if (next === undefined) {
             return game;
        }

        var dir = getDir(next.subtract(game.pos));


        if (game.dir === dir) {
            return game.moveForward();
        }
        if ((game.dir + 5) % 4 === dir) {
            return game.turnRight();
        }
        return game.turnLeft();
    };

    return edgeMover;
});
