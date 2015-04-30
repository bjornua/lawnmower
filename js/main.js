define(["react", "immutable", "vector"], function (React, Immutable, Vector) {
    "use strict";

    var Rectangle = Immutable.Record({
        topLeft: undefined,
        s: undefined
    }, "Rectangle");

    var toPercent = function (val) {
        return (val * 100).toFixed(4) + "%";
    };


    var Tile = React.createClass({
        displayName: "Tile",
        render: function () {
            var self = this;

            vx = Immutable.List([self.props.pos, new Vector([1, 1])]);

            rect = rect.map(function (v) {
                var divided = v.divide(self.props.grid);
                var percentage = divided.map(toPercent);
                return percentage;
            });


            var style = Immutable.fromJS({
                position: "absolute",
                overflow: "hidden",
                left: rect.topLeft.x,
                top: rect.topLeft.y,
                width: rect.s.x,
                bottom: rect.s.y,
                border: "1px solid rgba(0, 50, 0, 1)"
            });
            style = style.merge(style, self.props.style);

            return React.createElement("div", {style: style.toJS()}, self.props.children);

        }
    });
    var GrassTile = React.createClass({
        render: function () {
            return React.createElement(Tile, {
                pos: this.props.pos,
                grid: this.props.grid,
                style: {
                    // background: "url('./img/GrassGreenTexture0001.jpg')",
                    background: "url('./img/grass.jpg')",
                    "backgroundSize": "100% 100%"

                }
            });
        }
    });


    var LawnMower = React.createClass({
        displayName: "LawnMower",
        render: function () {
            return React.createElement(Tile, {
                pos: this.props.pos,
                grid: this.props.grid,
                style: {
                    background: "rgba(255, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 0, 0, 0.4)",
                    fontSize: "100px",
                    lineHeight: "67px",
                    transform: "rotate(90deg)"
                }
            }, "→");


        }
    });

    var GridWidget = React.createClass({
        displayName: "Grid",

        render: function () {
            var self = this;
            var tiles = Immutable.Range(0, self.props.grid.get(0)).map(function (y) {
                return Immutable.Range(0, self.props.grid.get(1)).map(function (x) {
                    var pos = new Vector([x, y]);
                    return React.createElement(GrassTile, {pos: pos, grid: self.props.grid, key: String(x) + "_" + String(y)});
                });
            }).flatten(1);

            // React.createElement(Tile, {x: 0, y: 0, width: 4, height: 3}),
            return React.createElement("div", {style: {
                width: "1000px",
                height: "1000px",
                position: "relative"
            }},
                tiles.toJS(),
                React.createElement(LawnMower, {pos: new Vector([0, 0]), grid: self.props.grid})
            );

        }
    });

    var Main = React.createClass({
        displayName: "main",
        render: function () {
            return React.createElement(GridWidget, {grid: new Vector([10, 10])});
        }
    });

    var element = React.createElement(Main);

    React.render(element, window.document.getElementById("main"));
});
