(function (ism) {
    "use strict";

    ism.drag = function (element, onDrag) {
        var drag = {},
            lastEvt = null;
        element.addEventListener("mousedown", drag, false);
        // subscribe to all mouse up events to prevent a "sticky" pointer
        window.addEventListener("mouseup", drag, false);

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
