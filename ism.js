var ism = {};
(function (ism) {
    "use strict";

    /*
     * A map item that contains a plain image. The image can be any format
     * that is supported by the browser, e.g. PNG, JPEG, GIF
     *
     * @constructor
     * @class - A simple layer consisting of a plain image
     * @param url - The URL of the raster image
     */
    ism.image = function (spec) {
        var image = {},
            width = spec.width || 256,
            height = spec.height || 256,
            url = spec.url,
            element = ism.svg("image"),
            map;

        element.setAttribute("width", width);
        element.setAttribute("height", height);
        // Center around 0,0
        element.setAttribute("x", -(width / 2));
        element.setAttribute("y", -(height / 2));
        element.setAttributeNS("http://www.w3.org/1999/xlink",
            "href", url);

        image.map = function (m) {
            if (arguments.length === 0) {
                return map;
            }
            m.layers().appendChild(element);
            map = m;
            return image;
        };

        return image;
    };

    return ism;
}(ism));
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
            apply = function () {
                var mag = Math.pow(2, zoom),
                    t = "scale(" + (mag) + ") " +
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

        map.zoom = function (level) {
            if (typeof(level) !== "number") {
                return zoom;
            }
            zoom = level;
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
(function (ism) {
    "use strict";

    /*
     * ism.element provides a shortcut to the otherwise verbose creation
     * of SVGElements. Example: ism.element("rect") will create an
     * SVGRect element.
     *
     * @param {String} tag
     * @returns {SVGElement}
     */
    ism.svg = function (tag) {
        return document.createElementNS("http://www.w3.org/2000/svg", tag);
    };

    return ism;
}(ism));
