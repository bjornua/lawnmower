define(["vector", "game", "immutable"], function (Vector, Game, Immutable) {
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

    var getPerimeter = function (pos, area) {
        return Immutable.fromJS([
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0]
        ]).map(function (val) {
            return pos.add(new Vector(val.get(0), val.get(1)));
        }).filter(function (newPos) {
            return area.getTileType(newPos) === Game.TILE_GRASS_UNCUT;
        });
    };

    var edgeMover = function (game) {
        var next = getPerimeter(game.pos, game.area).minBy(function (pos) {
            var perimeter = getPerimeter(pos, game.area);
            var dir = getDir(pos.subtract(game.pos));
            return perimeter.size - (game.dir === dir ? 0.5 : 0);
        });

        if (next.size !== undefined) {
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
