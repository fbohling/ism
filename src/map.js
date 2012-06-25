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
