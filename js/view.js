define(["react", "immutable", "vector", "game", "ai/edgemover"], function (React, Immutable, Vector, Game, AI) {
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
        mixins: [PureRenderMixin],
        render: function () {
            var self = this;
            var pos = self.props.pos;
            var size = new Vector(1, 1);
            var dir = self.props.orientation;

            var scale = function (vec) {
                var gridPos = vec.divide(self.props.bounds);
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
                left: Math.floor(pos.x) + "px",
                top: Math.floor(pos.y) + "px",
                width: Math.ceil(size.x) + "px",
                height: Math.ceil(size.y) + "px",
                lineHeight: Math.ceil(size.y) + "px",
                transform: "rotate(" + rot + "deg)",
                fontSize: Math.ceil(Math.min(size.y, size.x)) + "px",
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
        displayName: "GrassTile",
        mixins: [PureRenderMixin],
        render: function () {
            return React.createElement(Tile, {
                pos: this.props.pos,
                bounds: this.props.bounds,
                canvas: this.props.canvas,
                style: {
                    backgroundColor: this.props.cut ? "rgb(0, 180, 0)" : "rgb(0, 150, 0)",
                    textAlign: "center",
                    fontSize: "40px"
                },
                orientation: 0
            });
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
                orientation: this.props.dir
            }, ">");
        }
    });

    var GridWidget = React.createClass({
        displayName: "Grid",
        mixins: [PureRenderMixin],
        getInitialState: function () {
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            };
        },
        componentDidMount: function () {
            var self = this;

            window.addEventListener("resize", function () {
                self.setState({
                    width: document.body.clientWidth,
                    height: document.body.clientHeight
                });
           });
        },
        render: function () {
            var self = this;
            var canvas = new Vector(self.state.width, self.state.height);
            var tiles = Immutable.Range(0, self.props.game.area.bounds.y).map(function (y) {
                return Immutable.Range(0, self.props.game.area.bounds.x).map(function (x) {
                    var pos = new Vector(x, y);
                    var tile = self.props.game.getTile(pos);
                    return React.createElement(GrassTile, {
                        pos: pos,
                        bounds: self.props.game.area.bounds,
                        key: String(x) + "_" + String(y),
                        canvas: canvas,
                        cut: tile.type === Game.TILE_GRASS_CUT
                    });
                });
            }).flatten(1);
            var middle = canvas.divide(new Vector(-2, -2));

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
                React.createElement(LawnMower, {
                    pos: self.props.game.pos,
                    bounds: self.props.game.area.bounds,
                    canvas: canvas,
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
                game: Game.Game(),
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
            }, 1);
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
