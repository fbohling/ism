(function (ism) {
    "use strict";

    ism.svg = function (tag) {
        return document.createElementNS("http://www.w3.org/2000/svg", tag);
    };

    ism.point = function (coordinates) {
        var p = ism.svg("svg").createSVGPoint();
        p.x = coordinates.x;
        p.y = coordinates.y;
        return p;
    };

    return ism;
}(ism));
