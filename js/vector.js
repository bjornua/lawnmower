define(["immutable"], function (Immutable) {
    "use strict";

    var VectorStruct = Immutable.Record({
        x: undefined,
        y: undefined
    }, "Vector");

    var Vector = function (x, y) {
        return VectorStruct({x: x, y: y});
    };

    VectorStruct.prototype.add = function (other) {
        return Vector(
            this.x + other.x,
            this.y + other.y
        );
    };
    VectorStruct.prototype.subtract = function (other) {
        return Vector(
            this.x - other.x,
            this.y - other.y
        );
    };
    VectorStruct.prototype.divide = function (other) {
        return Vector(
            this.x / other.x,
            this.y / other.y
        );
    };
    VectorStruct.prototype.multiply = function (other) {
        return Vector(
            this.x * other.x,
            this.y * other.y
        );
    };
    VectorStruct.prototype.invert = function() {
        return Vector(this.y, this.x);
    };
    VectorStruct.prototype.map = function (f) {
        return Vector(f(this.x), f(this.y));
    };
    VectorStruct.prototype.toString = function () {
        return "Vector(" + String(this.x) + ", " + String(this.y) + ")";
    };

    return Vector;

});
