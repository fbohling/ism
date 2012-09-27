(function (ism) {
    "use strict";

    ism.map = function (spec) {
        var map = {},
            container = spec.container,
            width = spec.width,
            height = spec.height,
            zoomRange = spec.zoomRange || [0, 10],
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
            layers;

        map.add = function (object) {
            object.map(map);
            return map;
        };

        map.angle = function (deg) {
            if (typeof(deg) !== "number") {
                return angle;
            } else {
                angle = deg;
                apply();
            }
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
            // Get the inversed transformation matrix of the layer element
            // to transform between the layers and screen coordinate systems.
            var p = container.createSVGPoint(),
                m = layers.getCTM().inverse();
            // Set translation to 0
            m.e = 0;
            m.f = 0;
            // Set up p
            p.x = delta.x;
            p.y = delta.y;
            // transform p with m
            p = p.matrixTransform(m);
            // Recenter map
            map.center({
                "x" : map.center().x - (p.x),
                "y" : map.center().y + (p.y)
            });
        };

        map.zoom = function (level) {
            if (typeof(level) !== "number") {
                return zoom;
            }
            //Keep level inside the zoomRange
            level = level < zoomRange[0] ? zoomRange[0] : level;
            level = level > zoomRange[1] ? zoomRange[1] : level;

            zoom = level;
            apply();
            return map;
        };

        map.zoomBy = function (delta, point) {
            var z = zoom,
                panDist;
            map.zoom(zoom + delta);
            // Pan around point, if defined
            if (typeof(point) === "object") {
                // Recalculate delta, in case map.zoom hit a constraint
                delta = zoom - z;
                panDist = function (a) {
                    return -(a * (Math.pow(2, delta) - 1));
                };
                map.panBy({"x": panDist(point.x), "y": panDist(point.y)});
            }
            return map;
        };

        // Initialize
        container.setAttribute("width", width);
        container.setAttribute("height", height);
        container.setAttribute("viewBox",
            (-width / 2) + " " + (-height / 2) + " " + width + " " + height);
        layers = ism.svg("g");
        container.appendChild(layers);
        apply();

        return map;
    };

    return ism;
}(ism));
