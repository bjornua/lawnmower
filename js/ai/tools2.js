define(["vector", "immutable", "game/tile"], function (Vector, Immutable, Tile) {
    "use strict";


    var perimeter = Immutable.Seq.of(
        Vector(0, -1),
        Vector(1, 0),
        Vector(0, 1),
        Vector(-1, 0)
    ).cacheResult();

    var getAdjacent = function (area, pos) {
        return perimeter.map(function (dir) {
            return pos.add(dir);
        });
    };

    var expand0 = function (area, prevEnds, ends) {
        return ends.reduce(function (newEnds, pos) {
            return newEnds.union(getAdjacent(area, pos));
        }, Immutable.Set()).filter(function (pos) {
            return (
                area.inBounds(pos) &&
                !prevEnds.has(pos)
            );
        });
    };
    var expand = expand0;
    var bfs = function (pos, area) {

        var ends = Immutable.Set.of(pos);
        var prevEnds = Immutable.Set();
        var tmpEnds;
        Immutable.Range().takeWhile(function () {
            return ends.size > 0;
        }).map(function () {
            tmpEnds = expand(area, prevEnds, ends);
            prevEnds = ends;
            ends = tmpEnds;
            tmpEnds = undefined;
        });
    };

    return {
        getAdjacent: getAdjacent,
        bfs: bfs
    };
});
