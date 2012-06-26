(function (ism) {
    "use strict";

    ism.map = function (spec) {
        var map = {},
            container = spec.container,
            zoom = 0,
            viewBox = function (nBox) {
                container.setAttributeNS(null, "viewBox",
                    nBox.x + " " + nBox.y + " " +
                    nBox.width + " " + nBox.height);
            },
            cr = function () {
                return container.getClientRects()[0];
            };

        map.resize = function () {
            viewBox({x : 0, y : 0, width : cr().width, height : cr().height});
        };

        map.add = function (object) {
            object.map(map);
            return map;
        };

        map.container = function () {
            return container;
        };

        map.zoom = function (level) {
            var mag = Math.pow(2, level);
            if (typeof(level) !== "number") {
                return zoom;
            }
            zoom = level;
            viewBox({x : 0, y : 0, width : cr().width * (1 / mag),
                height : cr().height * (1 / mag)});
            return map;
        };

        map.resize();

        return map;
    };

    return ism;
}(ism));
