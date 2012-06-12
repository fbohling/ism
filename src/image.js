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
