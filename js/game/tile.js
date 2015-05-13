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


    return {
        Tile: Tile,
        TILE_GRASS_CUT: TILE_GRASS_CUT,
        TILE_GRASS_UNCUT: TILE_GRASS_UNCUT,
        TILE_OOB: TILE_OOB
    };

});
