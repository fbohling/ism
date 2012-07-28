(function (ism) {
    "use strict";

    /**
     * A wheel control binds itself to the document element. 
     * When the mouswheel is scrolled, it will call the function
     * defined in the onChange parameter.
     *
     * @param onChange - function to call when mousewheel is moved
     */
    ism.wheel = function (onChange) {
        var wheel = {};
        // for w3c
        document.addEventListener("mousewheel", wheel, false);
        // for Firefox
        document.addEventListener("DOMMouseScroll", wheel, false);

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
