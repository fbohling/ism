(function (ism) {
    "use strict";

    ism.tiled = function (spec) {
        var tiled = {},
            width = spec.width || 256,
            height = spec.height || 256,
            x = spec.x || 0,
            // negate spec.y to make the y axis point up
            y = -spec.y || 0,
            clazz = spec.class || "",
            element = ism.svg("svg"),
            tiles = [],
            draw = function () {
                var divs = Math.pow(2, zoom),
                    line = "",
                    size = width,
                    r,
                    x,
                    y;

                // delete old tiles
                tiles.map(function (t) {
                        t.parentNode.removeChild(t);
                    });
                tiles = [];

                // draw
                for (y = 0; y < divs; y += 1) {
                    for (x = 0; x < divs; x += 1) {
                        r = ism.svg("rect");
                        r.setAttribute("x", x * size / divs);
                        r.setAttribute("y", y * size / divs);
                        r.setAttribute("width", (size - 1) / divs);
                        r.setAttribute("height", (size - 1) / divs);
                        element.appendChild(r);
                        tiles.push(r);
                    }
                }
            },
            map,
            zoom;

        element.setAttribute("width", width);
        element.setAttribute("height", height);
        element.setAttribute("x", x - (width / 2));
        element.setAttribute("y", y - (height / 2));
        element.setAttribute("class", clazz);

        tiled.map = function (m) {
            if (arguments.length === 0) {
                return map;
            }
            m.layers().appendChild(element);
            map = m;
            map.on("zoom", tiled.update);
            tiled.update();
            return tiled;
        };

        tiled.update = function () {
            var z = Math.round(map.zoom());
            if (z !== zoom) {
                zoom = z;
                draw();
            }
            return tiled;
        };

        return tiled;
    };

    return ism;
}(ism));
