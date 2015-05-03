define([], function () {
    "use strict";

    class Vector {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            Object.freeze(this);
        }
        add(other) {
            return new Vector(
                this.x + other.x,
                this.y + other.y
            );
        }
        subtract(other) {
            return new Vector(
                this.x - other.x,
                this.y - other.y
            );
        }
        divide(other) {
            return new Vector(
                this.x / other.x,
                this.y / other.y
            );
        }
        multiply(other) {
            return new Vector(
                this.x * other.x,
                this.y * other.y
            );
        }
        invert() {
            return new Vector(this.y, this.x);
        }
        map (f) {
            return new Vector(f(this.x), f(this.y));
        }
        toString () {
            return "Vector(" + String(this.x) + ", " + String(this.y) + ")";
        }
    }

    return Vector;

});
