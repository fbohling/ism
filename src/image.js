(function (ism) {
    "use strict";

    ism.image = function (spec) {
        var image = {},
            width = spec.width || 256,
            height = spec.height || 256,
            x = spec.x || 0,
            // negate spec.y to make the y axis point up
            y = -spec.y || 0,
            url = spec.url,
            clazz = spec.class || "",
            element = ism.svg("image"),
            map;

        element.setAttribute("width", width);
        element.setAttribute("height", height);
        element.setAttribute("x", x - (width / 2));
        element.setAttribute("y", y - (height / 2));
        element.setAttribute("class", clazz);
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
