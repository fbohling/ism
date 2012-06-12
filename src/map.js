(function (ism) {
    "use strict";

    ism.map = function (spec) {
        var map = {},
            container = spec.container,
            zoomLevel = 0;

        container.setAttribute("viewbox", "0 0" + " " +
            container.getClientRects()[0].width + " " +
            container.getClientRects()[0].height);

        map.add = function (object) {
            object.map(map);
            return map;
        };

        map.container = function () {
            return container;
        };

        return map;
    };

    return ism;
}(ism));
