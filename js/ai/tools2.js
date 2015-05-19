define(["vector", "immutable", "game/tile"], function (Vector, Immutable, Tile) {
    "use strict";

    var perimeter = Immutable.Seq.of(
        Vector(0, -1),
        Vector(1, 0),
        Vector(0, 1),
        Vector(-1, 0)
    ).cacheResult();

    var BFSResult = Immutable.Record({
        pos: undefined,
        dist: undefined
    });

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
    var bfs = function (initialPos, area) {
        var ends = Immutable.Set.of(initialPos);
        var prevEnds = Immutable.Set();
        var dist = 0;
        return Immutable.Range().takeWhile(function () {
            return ends.size > 0;
        }).map(function () {
            var tmpEnds = expand(area, prevEnds, ends);
            prevEnds = ends;
            ends = tmpEnds;
            var res = prevEnds.map(function (pos) {
                return BFSResult({pos: pos, dist: dist});
            });
            dist += 1;
            return res;

        }).flatten(1);
    };

    return {
        getAdjacent: getAdjacent,
        bfs: bfs
    };
});
