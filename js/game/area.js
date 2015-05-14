define(["vector", "immutable", "game/tile"], function (Vector, Immutable, Tile) {
    "use strict";

    var AreaStruct = Immutable.Record({
        tiles: Immutable.List(),
        bounds: Vector(10, 10)
    }, "Area");

    AreaStruct.prototype.inBounds = function (pos) {
        return (
            pos.x >= 0
            && pos.y >= 0
            && pos.x < this.bounds.x
            && pos.y < this.bounds.y
        );
    };
    AreaStruct.prototype.getTile = function (pos) {
        if (!this.inBounds(pos)) {
            var tile = Tile.Tile({pos: pos});
            return tile.set("type", Tile.TILE_OOB);
        }
        return this.tiles.get(pos.x + pos.y * this.bounds.x);
    };
    AreaStruct.prototype.setTile = function (tile) {
        if (!this.inBounds(tile.pos)) {
            throw "OOB Error";
        }
        return this.setIn(["tiles", tile.pos.x + tile.pos.y * this.bounds.x], tile);
    };

    AreaStruct.prototype.isCompleted = function () {
        return this.bounds.x * this.bounds.y === this.grassCut.size;
    };
    AreaStruct.prototype.cut = function (pos) {
        var tile = this.getTile(pos);
        if (tile.type === Tile.TILE_GRASS_UNCUT) {
            tile = tile.set("type", Tile.TILE_GRASS_CUT);
            return this.setTile(tile);
        }
        return this;
    };

    var Area = function () {
        var area = AreaStruct();
        var tiles = Immutable.Range(0, area.bounds.y).map(function (y) {
            return Immutable.Range(0, area.bounds.x).map(function (x) {
                var pos = Vector(x, y);
                return Tile.Tile({
                    pos: pos
                });
            });
        }).flatten(1);
        return area.set("tiles", area.tiles.concat(tiles));
    };

    return {
        Area: Area
    };

});