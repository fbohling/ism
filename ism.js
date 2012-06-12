var ism = (function () {
    //Tell the interpreter to put this file into a strict context
    "use strict";
    // This Object holds all public functions
    var ism = {};

    return ism;
}());
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
