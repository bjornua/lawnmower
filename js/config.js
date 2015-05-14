var debug = {
    immutable: "3rdparty/immutable",
    react: "3rdparty/react-with-addons"
};
var fast = {
    immutable: "3rdparty/immutable.min",
    react: "3rdparty/react.min"
};

require.config({
    map: {
        "*": debug
    }
});

define(["main"], function () {
    "use strict";
});
