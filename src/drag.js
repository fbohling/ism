(function (ism) {
    "use strict";

    /**
     * drag is a control that observes a given element. When
     * the element is dragged, i.e. the left mouse button is pressed and hold
     * while the mouse is moved, it will call a function and hand over an
     * object holding information, on how much the element was draged.
     *
     * @param element - An element to observe
     * @param onDrag - A function to call when a vertical drags
     *            discovered. It will be called with an object of the
     *            following form: {"x": horizontal distance,
     *                             "y": vertical distance}
     */
    ism.drag = function (element, onDrag) {
        var drag = {},
            lastEvt = null;
        element.addEventListener("mousedown", drag, false);
        // subscribe to all mouse up events to prevent a "sticky" pointer
        window.addEventListener("mouseup", drag, false);

        /**
         * Handles all events fired on drag
         * @param evt - event object
         */
        drag.handleEvent = function (evt) {
            if (evt.type === "mousemove") {
                evt.preventDefault();
                onDrag({
                    "x" : evt.clientX - lastEvt.clientX,
                    "y" : evt.clientY - lastEvt.clientY
                });
                lastEvt = evt;
            } else if (evt.type === "mousedown") {
                evt.preventDefault();
                lastEvt = evt;
                window.addEventListener("mousemove", drag, false);
                element.setAttribute("cursor", "move");
            } else if (evt.type === "mouseup") {
                window.removeEventListener("mousemove", drag, false);
                element.setAttribute("cursor", "default");
            }
        };
        return drag;
    };

    return ism;
}(ism));
