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
            zoom = 0;

        //TODO: Make a private viewBox function
        container.setAttribute("viewBox", "0 0" + " " +
            container.getClientRects()[0].width + " " +
            container.getClientRects()[0].height);

        map.add = function (object) {
            object.map(map);
            return map;
        };

        map.container = function () {
            return container;
        };

        map.zoom = function (level) {
            if (typeof(level) !== "number") {
                return zoom;
            }
            zoom = level;
            var magnification = Math.pow(2, zoom);
            container.setAttribute("viewBox", "0 0" + " " +
            container.getClientRects()[0].width * (1/magnification) + " " +
            container.getClientRects()[0].height  * (1/magnification));
            return map;
        };

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
