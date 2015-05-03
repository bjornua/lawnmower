define(["vector", "immutable"], function (Vector, Immutable) {
    "use strict";

    var TILE_GRASS_CUT = Symbol("Tile: Cut Grass");
    var TILE_GRASS_UNCUT = Symbol("Tile: Uncut Grass");
    var TILE_OOB = Symbol("Tile: Out of bounds");

    var Area = Immutable.Record({
        grassCut: Immutable.Set(Immutable.fromJS([
            [0, 0], [4, 1], [4, 2], [4, 0]
        ])),
        bounds: new Vector(20, 20)
    });
    Area.prototype.getTileType = function (pos) {
        if (
               pos.x < 0
            || pos.y < 0
            || pos.x >= this.bounds.x
            || pos.y >= this.bounds.y
        ) {
            return TILE_OOB;
        }
        if (this.isCut(pos)) {
            return TILE_GRASS_CUT;
        }
        return TILE_GRASS_UNCUT;
    };
    Area.prototype.cut = function (pos) {
        return this.merge({
            grassCut: this.grassCut.add(Immutable.List([pos.x, pos.y]))
        });
    };
    Area.prototype.isCut = function (pos) {
        return this.grassCut.has(Immutable.List([pos.x, pos.y]));
    };

    var Game = Immutable.Record({
        area: Area(),
        pos: new Vector(0, 0),
        dir: 0,
        prevMove: null
    }, "Game");

    Game.prototype.turnRight = function () {
        var newDir = this.dir;
        if (newDir === 3) {
            newDir = 0;
        } else {
            newDir += 1;
        }
        return this.merge({
            dir: newDir
        });
    };
    Game.prototype.turnLeft = function () {
        var newDir = this.dir;
        if (newDir === 0) {
            newDir = 3;
        } else {
            newDir -= 1;
        }
        return this.merge({
            dir: newDir
        });

    };
    Game.prototype.cut = function (pos) {
        return this.merge({
            area: this.area.cut(pos)
        });
    };
    Game.prototype.getTileType = function (pos) {
        return this.area.getTileType(pos);
    };
    Game.prototype.moveForward = function () {
        var v;
        if (this.dir === 0) {
            v = new Vector(1, 0);
        } else if (this.dir === 1) {
            v = new Vector(0, 1);
        } else if (this.dir === 2) {
            v = new Vector(-1, 0);
        } else if (this.dir === 3) {
            v = new Vector(0, -1);
        }

        var newPos = this.pos.add(v);
        if (this.getTileType(newPos) !== TILE_OOB) {

            return this.merge({
                pos: newPos
            }).cut(newPos);
        }
        return this;
    };
    Game.prototype.backward = function () {
    };

    return {
        Game: Game,
        TILE_GRASS_CUT: TILE_GRASS_CUT,
        TILE_GRASS_UNCUT: TILE_GRASS_UNCUT,
        TILE_OOB: TILE_OOB
    };
});