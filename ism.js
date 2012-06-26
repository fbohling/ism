var ism = {};
(function (ism) {
    "use strict";

    /*
     * A map item that contains a plain image. The image can be any format
     * that is supported by the browser, e.g. PNG, JPEG, GIF, TIFF, BMP
     *
     * @constructor
     * @class - A layer consisting of a plain image
     * @param url - The URL of the raster image
     */
    ism.image = function (spec) {
        var image = {},
            width = spec.width || 256,
            height = spec.height || 256,
            url = spec.url,
            element = ism.svg("image");

        element.setAttribute("width", width);
        element.setAttribute("height", height);
        element.setAttributeNS("http://www.w3.org/1999/xlink",
            "href", url);

        image.map = function (map) {
            if (arguments.length === 0) {
                return spec.map;
            }
            map.container().appendChild(element);
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
