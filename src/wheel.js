(function (ism) {
    "use strict";

    /**
     * A wheel control observes a given element.
     * When the mouswheel is scrolled on it, a function
     * defined in the onChange parameter will be called with an integer
     * holding the wheel delta.
     *
     * @param onChange - function to call when mousewheel is moved
     */
    ism.wheel = function (element, onChange) {
        var wheel = {};
        // for w3c
        element.addEventListener("mousewheel", wheel, false);
        // for Firefox
        element.addEventListener("DOMMouseScroll", wheel, false);

        /**
         * Handles all events, that are fired on wheel
         * @param evt - event object
         */
        wheel.handleEvent = function (evt) {
            if (evt.type === "mousewheel" || evt.type === "DOMMouseScroll") {
                evt.preventDefault();
                var delta = 0;
                if (!evt) {
                    evt = window.event;
                }

                // Normalize the delta
                if (evt.wheelDelta) {
                    delta = evt.wheelDelta / 120;
                } else if (evt.detail) {
                    delta = -evt.detail / 3;
                }

                onChange(delta);
            }
        };

        return wheel;
    };

    return ism;
}(ism));
