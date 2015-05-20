define(["vector", "immutable", "game/area", "game/tile"], function (Vector, Immutable, Area, Tile) {
    "use strict";

    var World = Immutable.Record({
        area: Area.Area(),
        pos: Vector(1, 0),
        dir: 0,
        score: 0,
        customState: Immutable.Map()
    }, "World");

    World.prototype.turnRight = function () {
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

    World.prototype.turnLeft = function () {
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

    World.prototype.isCompleted = function () {
        return this.area.isCompleted();
    };

    World.prototype.cut = function (pos) {
        var tile = this.getTile(pos);
        if (tile.type !== Tile.TILE_GRASS_UNCUT) {
            return this;
        }
        return this.merge({
            score: this.score + 2,
            area: this.area.cut(pos)
        });
    };

    World.prototype.getTile = function (pos) {
        return this.area.getTile(pos);
    };

    World.prototype.setTile = function (tile) {
        return this.set("area", this.area.setTile(tile));
    };

    World.prototype.setNumber = function (pos, number) {
        var tile = this.getTile(pos);
        tile = tile.set("number", number);
        return this.setTile(tile);
    };

    World.prototype.moveForward = function () {
        var v;
        if (this.dir === 0) {
            v = Vector(1, 0);
        } else if (this.dir === 1) {
            v = Vector(0, 1);
        } else if (this.dir === 2) {
            v = Vector(-1, 0);
        } else if (this.dir === 3) {
            v = Vector(0, -1);
        }

        var newPos = this.pos.add(v);
        if (this.getTile(newPos).type !== Tile.TILE_OOB) {
            return this.merge({
                score: this.score - 0.3333,
                pos: newPos
            }).cut(newPos);
        }
        return this.merge({
            score: this.score - 0.3333
        });
    };

    World.prototype.setState = function (key, value) {
        return this.setIn(["customState", key], value);
    };
    World.prototype.getState = function (key) {
        return this.customState.get(key);
    };
    return {
        World: World
    };
});
