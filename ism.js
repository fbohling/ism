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
            m.container().appendChild(element);
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
            zoom = 0,
            viewBox = function (newVB) {
                if (!newVB) {
                    var contVB = container.getAttribute("viewBox")
                            .split(" ").map(parseFloat);
                    return {
                        "x" : contVB[0],
                        "y" : contVB[1],
                        "width" : contVB[2],
                        "height" : contVB[3]
                    };
                } else {
                    container.setAttributeNS(null, "viewBox",
                    newVB.x + " " + newVB.y + " " +
                    newVB.width + " " + newVB.height);
                }
            },
            clientRect = function () {
                return container.getClientRects()[0];
            };


        map.add = function (object) {
            object.map(map);
            return map;
        };

        map.container = function () {
            return container;
        };

        map.center = function (coordinates) {
            if (!coordinates) {
                return {
                    "x" : (viewBox().x + viewBox().width / 2),
                    "y" : -(viewBox().y + viewBox().height / 2)
                };
            } else {
                viewBox({
                    "x" : coordinates.x - viewBox().width / 2,
                    "y" : -coordinates.y - viewBox().height / 2,
                    "width" : viewBox().width,
                    "height" : viewBox().height
                });
            }
        };

        map.resize = function () {
            viewBox({"x" : 0, "y" : 0, "width" : clientRect().width, "height" : clientRect().height});
        };

        map.zoom = function (level) {
            if (typeof(level) !== "number") {
                return zoom;
            }
            var mag = Math.pow(2, level),
                width = clientRect().width * (1 / mag),
                height = clientRect().height * (1 / mag);
            zoom = level;
            viewBox({
                "x" : map.center().x - width / 2,
                "y" : -map.center().y - height / 2,
                "width" : width,
                "height" : height
            });
            return map;
        };

        // resize map after creation and center it at 0,0
        map.resize();
        map.center({"x" : 0, "y" : 0});

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
