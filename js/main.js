require(
    ["react", "immutable"], function (React, Immutable) {
    "use strict";
    var Position = Immutable.Record({
        x: undefined,
        y: undefined
    });

    var Grid = Immutable.Record({
        width: undefined,
        height: undefined
    });

    var toPercent = function (val) {
        return (val * 100).toFixed(4) + "%";
    };

    var Tile = React.createClass({
        displayName: "Tile",
        render: function () {
            var x0, x1, y0, y1;

            x0 = this.props.pos.x / this.props.grid.width;
            x1 = (this.props.pos.x + 1) / this.props.grid.width;
            y0 = this.props.pos.y / this.props.grid.height;
            y1 = (this.props.pos.y + 1) / this.props.grid.height;

            var style = Immutable.fromJS({
                position: "absolute",
                overflow: "hidden",
                left: toPercent(x0),
                top: toPercent(y0),
                right: toPercent(1 - x1),
                bottom: toPercent(1 - y1),
                border: "1px solid rgba(0, 50, 0, 1)"
            });
            style = style.merge(style, this.props.style);

            return React.createElement("div", {style: style.toJS()}, this.props.children);

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
            var tiles = Immutable.Range(0, self.props.grid.height).map(function (y) {
                return Immutable.Range(0, self.props.grid.width).map(function (x) {
                    var pos = Position({x: x, y: y});
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
                React.createElement(LawnMower, {pos: Position({x: 0, y: 0}), grid: self.props.grid})
            );

        }
    });

    var Main = React.createClass({
        displayName: "main",
        render: function () {
            return React.createElement(GridWidget, {grid: Grid({width: 10, height: 10})});
        }
    });

    var element = React.createElement(Main);

    React.render(element, window.document.getElementById("main"));
});
