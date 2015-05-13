define(["vector", "immutable", "game/tile"], function (Vector, Immutable, Tile) {
    "use strict";

    var AreaData = Immutable.Record({
        tiles: Immutable.List(),
        bounds: new Vector(20, 20)
    }, "Area");

    AreaData.prototype.inBounds = function (pos) {
        return (
            pos.x >= 0
            && pos.y >= 0
            && pos.x < this.bounds.x
            && pos.y < this.bounds.y
        );
    };
    AreaData.prototype.getTile = function (pos) {
        var tile = Tile.Tile({pos: pos});
        if (!this.inBounds(pos)) {
            return tile.set("type", Tile.TILE_OOB);
        }
        return this.tiles.get(tile.pos.x + tile.pos.y * this.bounds.x, tile);
    };
    AreaData.prototype.setTile = function (tile) {
        if (!this.inBounds(tile.pos)) {
            throw "OOB Error";
        }
        return this.setIn(["tiles", tile.pos.x + tile.pos.y * this.bounds.x], tile);
    };

    AreaData.prototype.isCompleted = function () {
        return this.bounds.x * this.bounds.y === this.grassCut.size;
    };
    AreaData.prototype.cut = function (pos) {
        var tile = this.getTile(pos);
        if (tile.type === Tile.TILE_GRASS_UNCUT) {
            tile = tile.set("type", Tile.TILE_GRASS_CUT);
            return this.setTile(tile);
        }
        return this;
    };

    var Area = function () {
        var area = AreaData();
        var tiles = Immutable.Range(0, area.bounds.y).map(function (y) {
            return Immutable.Range(0, area.bounds.x).map(function (x) {
                var pos = new Vector(x, y);
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