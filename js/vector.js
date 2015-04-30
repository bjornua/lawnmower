define(["immutable"], function (Immutable) {
    "use strict";

    class Vector extends Immutable.List {
        add(other) {
            return this.mergeWith(function(a, b) {
                return a + b;
            }, other);
        };
        subtract(other) {
            return this.mergeWith(function(a, b) {
                return a - b;
            }, other);
        };
        divide(other) {
            return this.mergeWith(function(a, b) {
                return a / b;
            }, other);
        };
        invert() {
            return Vector([this.get(1), this.get(0)]);
        };
    }

    return Vector;

});
