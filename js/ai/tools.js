define(["vector", "immutable", "game/tile"], function (Vector, Immutable, Tile) {
    "use strict";


    var perimeter = Immutable.Seq([
        Vector(0, -1),
        Vector(1, 0),
        Vector(0, 1),
        Vector(-1, 0)
    ]);

    var getAdjacent = function (area, pos) {
        return perimeter.map(function (dir) {
            return pos.add(dir);
        }).filter(function (newPos) {
            return area.getTile(newPos).type !== Tile.TILE_OOB;
        });
    };

    var expand = function (area, prevEnds, ends) {
        return ends.map(function (pos) {
            return getAdjacent(area, pos);
        }).flatten(1).filter(function (pos) {
            return !prevEnds.has(pos);
        });
    };

    var bfs = function (pos, area, callback) {
        var ends = Immutable.Set.of(pos);
        var prevEnds = Immutable.Set();
        var tmpEnds;
        while(ends.size > 0 && callback(ends)) {
            tmpEnds = expand(area, prevEnds, ends);
            prevEnds = ends;
            ends = tmpEnds;
            tmpEnds = undefined;
        }
    };

    return {
        getAdjacent: getAdjacent,
        bfs: bfs
    };
});
