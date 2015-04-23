require.config({
    /*enforceDefine: true,*/
    baseUrl: "js",
    map: {
        "*": {
            immutable: "js/3rdparty/immutable.min",
            react: "js/3rdparty/react"
        }
    }
});

require(["main"], function () {
    "use strict";
});
