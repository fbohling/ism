(function (ism) {
    "use strict";

    ism.wheel = function (element, onChange) {
        var wheel = {};
        // for w3c
        element.addEventListener("mousewheel", wheel, false);
        // for Firefox
        element.addEventListener("DOMMouseScroll", wheel, false);

        wheel.handleEvent = function (evt) {
            if (evt.type === "mousewheel" || evt.type === "DOMMouseScroll") {
                evt.preventDefault();
                var delta = 0;

                // Normalize the delta
                if (evt.wheelDelta) {
                    delta = evt.wheelDelta / 120;
                } else if (evt.detail) {
                    delta = -evt.detail / 3;
                }

                // Return delta and mouse position
                onChange(delta, {
                    "x": evt.pageX - element.getScreenCTM().e,
                    "y": evt.pageY - element.getScreenCTM().f
                });
            }
        };

        return wheel;
    };

    return ism;
}(ism));
