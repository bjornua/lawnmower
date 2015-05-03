define(["react", "immutable", "vector", "game", "ai"], function (React, Immutable, Vector, Game, AI) {
    "use strict";

    var toPercent = function (val) {
        return (val * 100).toFixed(4) + "%";
    };

    var Tile = React.createClass({
        displayName: "Tile",
        shouldComponentUpdate: function (nextProps) {
            if (nextProps.pos.x !== this.props.pos.x) {
                return true;
            }
            if (nextProps.pos.y !== this.props.pos.y) {
                return true;
            }
            if (nextProps.area.bounds.x !== this.props.area.bounds.y) {
                return true;
            }
            if (nextProps.area.bounds.y !== this.props.area.bounds.y) {
                return true;
            }
            if (nextProps.children !== this.props.children) {
                return true;
            }

            return false;
        },
        render: function () {
            var self = this;
            var pos = self.props.pos;
            var size = new Vector(1, 1);
            var dir = self.props.orientation;

            var scale = function (vec) {
                var gridPos = vec.divide(self.props.area.bounds);
                var canvasPos = gridPos.multiply(self.props.canvas);
                return canvasPos;
            };

            pos = scale(pos);
            size = scale(size);

            if (dir === 1 || dir === 3) {
                var inv = size.invert();
                var offs = size.subtract(inv);
                var offsHalf = offs.divide(new Vector(2, 2));
                pos = pos.add(offsHalf);
                size = size.invert();
            }
            var rot = dir * 90;
            var style = Immutable.fromJS({
                position: "absolute",
                left: (pos.x - 0).toFixed(2) + "px",
                top: (pos.y - 0).toFixed(2) + "px",
                width: (size.x).toFixed(2) + "px",
                height: (size.y).toFixed(2) + "px",
                lineHeight: size.y.toFixed(2) + "px",
                transform: "rotate(" + rot + "deg)",
                fontSize: Math.min(size.y, size.x).toFixed(2) + "px",
                overflow: "hidden",
                verticalAlign: "middle",
                boxSizing: "border-box",
                border: "1px solid rgba(0, 50, 0, 1)"
            });
            style = style.merge(style, self.props.style);

            return React.createElement("div", {
                id: "tile_" + self.props.pos.x + "_" + self.props.pos.y,
                style: style.toJS()}, self.props.children);
        }
    });
    var GrassTile = React.createClass({
        render: function () {
            return React.createElement(Tile, {
                pos: this.props.pos,
                area: this.props.game.area,
                canvas: this.props.canvas,
                style: {
                    // background: "url('./img/GrassGreenTexture0001.jpg')",
                    // background: "url('./img/grass.jpg')",
                    "backgroundSize": "100% 100%",
                    textAlign: "center",
                    fontSize: "40px"
                },
                orientation: 0
            }, this.props.cut ? "-" : "+");
        }
    });


    var LawnMower = React.createClass({
        displayName: "LawnMower",
        render: function () {
            return React.createElement(Tile, {
                pos: this.props.pos,
                area: this.props.game.area,
                canvas: this.props.canvas,
                style: {
                    background: "rgba(255, 0, 0, 0.2)",
                    textAlign: "right"
                },
                orientation: this.props.game.dir
            }, ">");
        }
    });

    var GridWidget = React.createClass({
        displayName: "Grid",

        render: function () {
            var self = this;
            var canvas = new Vector(1000, 800);
            var tiles = Immutable.Range(0, self.props.game.area.bounds.y).map(function (y) {
                return Immutable.Range(0, self.props.game.area.bounds.x).map(function (x) {
                    var pos = new Vector(x, y);
                    return React.createElement(GrassTile, {
                        pos: pos,
                        game: self.props.game,
                        key: String(x) + "_" + String(y),
                        canvas: canvas,
                        cut: self.props.game.getTileType(pos) === Game.TILE_GRASS_CUT
                    });
                });
            }).flatten(1);
            var middle = canvas.divide(new Vector(-2, -2));

            // React.createElement(Tile, {x: 0, y: 0, width: 4, height: 3}),
            return React.createElement("div", {
                style: {
                    width: String(canvas.x) + "px",
                    height: String(canvas.y) + "px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginLeft: String(middle.x) + "px",
                    marginTop: String(middle.y) + "px",
                    overflow: "hidden"
                }
            },
                tiles.toJS(),
                React.createElement(LawnMower, {pos: self.props.game.pos, game: self.props.game, canvas: canvas})
            );

        }
    });

    var Main = React.createClass({
        displayName: "main",
        getInitialState: function () {
            return {
                game: Game.Game()
            };
        },
        componentDidMount: function () {
            var self = this;
            setInterval(function () {
                var game = AI.edgeMover(self.state.game);
                self.setState({
                    game: game
                });
            }, 10);
        },
        shouldComponentUpdate: function (nextProps, nextState) {
            return !this.state.game.equals(nextState.game);
        },
        render: function () {
            return React.createElement(GridWidget, {game: this.state.game});
        }
    });

    var element = React.createElement(Main);

    React.render(element, window.document.getElementById("main"));
});
