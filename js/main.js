define(["react", "immutable", "vector"], function (React, Immutable, Vector) {
    "use strict";

    var toPercent = function (val) {
        return (val * 100).toFixed(4) + "%";
    };

    var Tile = React.createClass({
        displayName: "Tile",
        render: function () {
            var self = this;
            var pos = self.props.pos;
            var size = new Vector(1, 1);
            var dir = this.props.orientation;

            var scale = function (vec) {
                return vec.divide(self.props.grid).multiply(self.props.canvas);
            };

            pos = scale(pos);
            size = scale(size);

            if (dir === 1 || dir === 3) {
                pos = pos.add(size.subtract(size.invert()).divide(new Vector(2, 2)));
                size = size.invert();
            }
            var rot = dir * 90;
            var style = Immutable.fromJS({
                position: "absolute",
                left: pos.x.toFixed(2) + "px",
                top: pos.y.toFixed(2) + "px",
                width: (size.x + 1).toFixed(2) + "px",
                height: (size.y + 1).toFixed(2) + "px",
                lineHeight: size.y.toFixed(2) + "px",
                transform: "rotate(" + rot + "deg)",
                fontSize: size.y.toFixed(2) + "px",
                overflow: "hidden",
                verticalAlign: "middle",
                boxSizing: "border-box",
                border: "1px solid rgba(0, 50, 0, 1)"
            });
            style = style.merge(style, self.props.style);

            return React.createElement("div", {
                id: "tile_" + this.props.pos.x + "_" + this.props.pos.y,
                style: style.toJS()}, self.props.children);
        }
    });
    var GrassTile = React.createClass({
        render: function () {
            return React.createElement(Tile, {
                pos: this.props.pos,
                grid: this.props.grid,
                canvas: this.props.canvas,
                style: {
                    // background: "url('./img/GrassGreenTexture0001.jpg')",
                    background: "url('./img/grass.jpg')",
                    "backgroundSize": "100% 100%"
                },
                orientation: 0
            });
        }
    });


    var LawnMower = React.createClass({
        displayName: "LawnMower",
        render: function () {
            return React.createElement(Tile, {
                pos: this.props.pos,
                grid: this.props.grid,
                canvas: this.props.canvas,
                style: {
                    background: "rgba(255, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 0, 0, 0.4)",
                    fontSize: "40px",
                    textAlign: "right"
                },
                orientation: 3
            }, "→");


        }
    });

    var GridWidget = React.createClass({
        displayName: "Grid",


        render: function () {
            var self = this;
            var canvas = new Vector(1000, 600);
            var tiles = Immutable.Range(0, self.props.grid.y).map(function (y) {
                return Immutable.Range(0, self.props.grid.x).map(function (x) {
                    var pos = new Vector(x, y);
                    return React.createElement(GrassTile, {
                        pos: pos,
                        grid: self.props.grid,
                        key: String(x) + "_" + String(y),
                        canvas: canvas
                    });
                });
            }).flatten(1);


            // React.createElement(Tile, {x: 0, y: 0, width: 4, height: 3}),
            return React.createElement("div", {style: {
                width: String(canvas.x) + "px",
                height: String(canvas.y) + "px",
                position: "relative",
                overflow: "hidden"
            }},
                tiles.toJS(),
                React.createElement(LawnMower, {pos: new Vector(9, 1), grid: self.props.grid, canvas: canvas})
            );

        }
    });

    var Main = React.createClass({
        displayName: "main",
        render: function () {
            return React.createElement(GridWidget, {grid: new Vector(30, 20)});
        }
    });

    var element = React.createElement(Main);

    React.render(element, window.document.getElementById("main"));
});
