(function (ism) {
    "use strict";

    ism.map = function (spec) {
        var map = {};

        spec.container.setAttribute("viewbox", "0 0" + " " +
            spec.container.getClientRects()[0].width + " " +
            spec.container.getClientRects()[0].height);

        return map;
    };

    return ism;
}(ism));
