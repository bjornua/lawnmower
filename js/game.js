define(["vector", "immutable"], function (Vector, Immutable) {
    "use strict";

    var TILE_GRASS_CUT = "TILE_GRASS_CUT";
    var TILE_GRASS_UNCUT = "TILE_GRASS_UNCUT";
    var TILE_OOB = "TILE_OOB";

    var Tile = Immutable.Record({
        pos: undefined,
        type: TILE_GRASS_UNCUT,
        number: undefined
    }, "Tile");

    var Area = Immutable.Record({
        tiles: Immutable.Map(),
        bounds: new Vector(5, 5)
    }, "Area");
    Area.prototype.inBounds = function (pos) {
        return (
            pos.x >= 0
            && pos.y >= 0
            && pos.x < this.bounds.x
            && pos.y < this.bounds.y
        );
    };
    Area.prototype.getTile = function (pos) {
        var tile = Tile({pos: pos});
        if (!this.inBounds(pos)) {
            return tile.set("type", TILE_OOB);
        }
        return this.tiles.get(pos, tile);
    };
    Area.prototype.setTile = function (tile) {
        if (!this.inBounds(tile.pos)) {
            throw "OOB Error";
        }
        return this.setIn(["tiles", tile.pos], tile);
    };

    Area.prototype.isCompleted = function () {
        return this.bounds.x * this.bounds.y === this.grassCut.size;
    };
    Area.prototype.cut = function (pos) {
        var tile = this.getTile(pos);
        if (tile.type === TILE_GRASS_UNCUT) {
            tile = tile.set("type", TILE_GRASS_CUT);
            return this.setTile(tile);
        }
        return this;
    };

    var Game = Immutable.Record({
        area: Area(),
        pos: new Vector(1, 0),
        dir: 0,
        score: 0
    }, "Game");
    Game.prototype.turnRight = function () {
        var newDir = this.dir;
        if (newDir === 3) {
            newDir = 0;
        } else {
            newDir += 1;
        }
        return this.merge({
            dir: newDir,
            score: this.score - 1
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
            dir: newDir,
            score: this.score - 1
        });

    };

    Game.prototype.isCompleted = function () {
        return this.area.isCompleted();
    };

    Game.prototype.cut = function (pos) {
        var tile = this.getTile(pos);
        if (tile.type !== TILE_GRASS_UNCUT) {
            return this;
        }
        return this.merge({
            score: this.score + 2,
            area: this.area.cut(pos)
        });
    };
    Game.prototype.getTile = function (pos) {
        return this.area.getTile(pos);
    };
    Game.prototype.setTile = function (tile) {
        return this.set("area", this.area.setTile(tile));
    };
    Game.prototype.setNumber = function (pos, number) {
        var tile = this.getTile(pos);
        tile = tile.set("number", number);
        return this.setTile(tile);
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
        if (this.getTile(newPos).type !== TILE_OOB) {
            return this.merge({
                score: this.score - 0.3333,
                pos: newPos
            }).cut(newPos);
        }
        return this.merge({
            score: this.score - 0.3333
        });
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
