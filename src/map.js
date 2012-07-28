(function (ism) {
    "use strict";

    ism.map = function (spec) {
        var map = {},
            container = spec.container,
            width = spec.width,
            height = spec.height,
            angle = 0,
            x = 0,
            y = 0,
            zoom = 0,
            mag = function () {
                return Math.pow(2, zoom);
            },
            apply = function () {
                var t = "scale(" + (mag()) + ") " +
                        "rotate(" + (angle) + ") " +
                        "translate(" + (-x) +
                        " " + y + ")";
                layers.setAttribute("transform", t);
            },
            layers,
            v;

        map.add = function (object) {
            object.map(map);
            return map;
        };

        map.container = function () {
            return container;
        };

        map.layers = function () {
            return layers;
        };

        map.center = function (coordinates) {
            if (!coordinates) {
                return {
                    "x" : x,
                    "y" : y
                };
            } else {
                x = coordinates.x;
                y = coordinates.y;
                apply();
                return map;
            }
        };

        map.panBy = function (delta) {
            map.center({
                "x" : map.center().x - (delta.x / mag()),
                "y" : map.center().y + (delta.y / mag())
            });
        };

        map.zoom = function (level) {
            if (typeof(level) !== "number") {
                return zoom;
            }
            zoom = level;
            apply();
            return map;
        };

        map.zoomBy = function (delta) {
            zoom += delta;
            apply();
            return map;
        };

        // Initialize
        container.setAttribute("width", width);
        container.setAttribute("height", height);
        v = (-width / 2) + " " + (-height / 2) + " " + width + " " + height;
        container.setAttribute("viewBox", v);
        layers = ism.svg("g");
        container.appendChild(layers);
        apply();

        return map;
    };

    return ism;
}(ism));
