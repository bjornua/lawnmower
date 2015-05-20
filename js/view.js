define(["react", "immutable", "vector", "game/world", "game/tile", "ai/heatmapper2"], function (React, Immutable, Vector, World, GTile, AI) {
    "use strict";

    var IMequals = function (a, b) {
        return Immutable.is(Immutable.fromJS(a), Immutable.fromJS(b));
    };

    var PureRenderMixin = {
        shouldComponentUpdate: function (nextProps, nextState) {
            return !(
                IMequals(nextProps, this.props)
                && IMequals(nextState, this.state)
            );
        }
    };

    var Tile = React.createClass({
        displayName: "Tile",
        getDefaultProps: function () {
            return {
                fontScale: 1
            };
        },
        mixins: [PureRenderMixin],
        render: function () {
            var self = this;
            var pos = self.props.pos;
            var next = self.props.pos.add(Vector(1, 1));
            var dir = self.props.orientation;

            var scale = function (vec) {
                var gridPos = vec.divide(self.props.bounds);
                var canvasPos = gridPos.multiply(self.props.canvas);
                return canvasPos;
            };

            pos = scale(pos);
            var size = scale(next).map(Math.floor);
            pos = pos.map(Math.floor);
            size = size.subtract(pos);

            if (dir === 1 || dir === 3) {
                var inv = size.invert();
                var offs = size.subtract(inv);
                var offsHalf = offs.divide(Vector(2, 2));
                pos = pos.add(offsHalf);
                size = size.invert();
            }
            var rot = dir * 90;
            var style = Immutable.fromJS({
                position: "absolute",
                left: pos.x + "px",
                top: pos.y + "px",
                width: size.x + "px",
                height: size.y + "px",
                lineHeight: size.y + "px",
                transform: "rotate(" + rot + "deg)",
                fontSize: Math.floor(this.props.fontScale * (Math.min(size.y, size.x))) + "px",
                overflow: "hidden",
                verticalAlign: "middle",
                boxSizing: "border-box"
                // border: "1px solid rgb(0, 155, 0)"
            });
            style = style.merge(style, self.props.style);

            return React.createElement("div", {
                // id: "tile_" + self.props.pos.x + "_" + self.props.pos.y,
                style: style.toJS()}, self.props.children);
        }
    });
    var GrassTile = React.createClass({
        displayName: "GrassTile",
        shouldComponentUpdate: function (nextProps) {
            return !(
                Immutable.is(this.props.tile, nextProps.tile) &&
                Immutable.is(this.props.bounds, nextProps.bounds) &&
                Immutable.is(this.props.canvas, nextProps.canvas)
            );
        },
        render: function () {
            return React.createElement(Tile, {
                pos: this.props.tile.pos,
                bounds: this.props.bounds,
                canvas: this.props.canvas,
                style: {
                    backgroundColor: this.props.tile.type === GTile.TILE_GRASS_CUT ? "rgb(0, 180, 0)" : "rgb(0, 160, 0)",
                    textAlign: "center"
                },
                fontScale: 0.2,
                orientation: 0
            }, this.props.tile.number !== undefined ? this.props.tile.number.toFixed(1) : "");
        }
    });


    var LawnMower = React.createClass({
        displayName: "LawnMower",
        mixins: [PureRenderMixin],
        render: function () {
            return React.createElement(Tile, {
                pos: this.props.pos,
                bounds: this.props.bounds,
                canvas: this.props.canvas,
                style: {
                    textAlign: "right"
                },
                orientation: this.props.dir,
                fontScale: 0.8
            }, ">");
        }
    });

    var GridWidget = React.createClass({
        displayName: "Grid",
        mixins: [PureRenderMixin],
        getInitialState: function () {
            return {
                canvas: this.getSize()
            };
        },
        getSize: function () {
            var sizeMin = Math.min(document.body.clientWidth, document.body.clientHeight);
            return Vector(sizeMin, sizeMin);
        },
        componentDidMount: function () {
            var self = this;

            window.addEventListener("resize", function () {
                self.setState({
                    canvas: self.getSize()
                });
           });
        },
        render: function () {
            var self = this;
            var tiles = self.props.game.area.tiles.map(function (tile, key) {
                return React.createElement(GrassTile, {
                    bounds: self.props.game.area.bounds,
                    key: key,
                    canvas: self.state.canvas,
                    tile: tile
                });
            });
            var middle = self.state.canvas.divide(new Vector(-2, -2));

            return React.createElement("div", {
                style: {
                    width: String(self.state.canvas.x) + "px",
                    height: String(self.state.canvas.y) + "px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginLeft: String(middle.x) + "px",
                    marginTop: String(middle.y) + "px",
                    overflow: "hidden"
                }
            },
                tiles.toJS(),
                React.createElement(LawnMower, {
                    pos: self.props.game.pos,
                    bounds: self.props.game.area.bounds,
                    canvas: self.state.canvas,
                    dir: self.props.game.dir
                }),
                React.createElement("button", {style: {
                    position: "absolute",
                    top: 0,
                    right: 0
                }, onClick: self.props.onStop}, "STOP/START"),
                React.createElement("div", {style: {
                    position: "absolute",
                    background: "rgba(255, 255, 255, 0.8)"
                }}, "Score: ", self.props.game.score.toFixed(2))
            );

        }
    });

    var Main = React.createClass({
        displayName: "main",
        getInitialState: function () {
            return {
                i: 0,
                game: World.World(),
                running: true
            };
        },
        componentDidMount: function () {
            var self = this;

            setInterval(function () {
                if (!self.state.running) {
                    return;
                }
                var game = AI(self.state.game);
                self.setState({
                    game: game,
                    i: self.state.i + 1
                });
            }, 500);
        },
        shouldComponentUpdate: function (nextProps, nextState) {
            return !this.state.game.equals(nextState.game);
        },
        render: function () {
            var self = this;
            return React.createElement(GridWidget, {
                game: this.state.game,
                onStop: function () {
                    self.setState({running: !self.state.running});
                }
            });
        }
    });

    return Main;
});
