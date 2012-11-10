(function (ism) {
    "use strict";

    ism.event = function (that) {
        var types = {};

        that.on = function (type, handler) {
            if (types.hasOwnProperty(type)) {
                types[type].push(handler);
            } else {
                types[type] = [handler];
            }
        };

        that.off = function (type, handler) {
            if (types.hasOwnProperty(type)) {
                // Create new type array without given handler
                types[type] = types[type].filter(function (x) {
                    return (x === handler ? false : true);
                });
            }
        };

        that.trigger = function (type) {
            if (types.hasOwnProperty(type)) {
                // fire all functions in types[type]
                types[type].map(function (x) {
                    x();
                });
            }
        };

        that.types = types;
    };

    return ism;
}(ism));
