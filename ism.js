var ism = {};
(function (ism) {
    "use strict";

    /**
     * drag is a control that is bound to the document element. When
     * the element is dragged, i.e. the left mouse button is pressed and hold
     * while the mouse is moved, it will call a function and hand over an
     * object holding information, how much the element was draged.
     *
     * @param onDrag - A function to call when a vertical drags
     *            discovered. It will be called with an object of the
     *            following form: {"x": horizontal distance,
     *                             "y": vertical distance}
     */
    ism.drag = function (onDrag) {
        var drag = {},
            lastEvt = null;
        window.addEventListener("mousedown", drag, false);
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
                //window.setAttributeNS(null, "cursor", "move");
            } else if (evt.type === "mouseup") {
                window.removeEventListener("mousemove", drag, false);
                //window.setAttributeNS(null, "cursor", "default");
            }
        };
        return drag;
    };

    return ism;
}(ism));
(function (ism) {
    "use strict";

    /*
     * A map item that contains a plain image. The image can be any format
     * that is supported by the browser, e.g. PNG, JPEG, GIF
     *
     * @constructor
     * @class - A simple layer consisting of a plain image
     * @param url - The URL of the raster image
     */
    ism.image = function (spec) {
        var image = {},
            width = spec.width || 256,
            height = spec.height || 256,
            url = spec.url,
            element = ism.svg("image"),
            map;

        element.setAttribute("width", width);
        element.setAttribute("height", height);
        // Center around 0,0
        element.setAttribute("x", -(width / 2));
        element.setAttribute("y", -(height / 2));
        element.setAttributeNS("http://www.w3.org/1999/xlink",
            "href", url);

        image.map = function (m) {
            if (arguments.length === 0) {
                return map;
            }
            m.layers().appendChild(element);
            map = m;
            return image;
        };

        return image;
    };

    return ism;
}(ism));
(function (ism) {
    "use strict";

    ism.map = function (spec) {
        var map = {},
            container = spec.container,
            width = spec.width,
            height = spec.height,
            angle = 0,
            x = 0,
            y = 0,
            zoom = 0,
            mag = function () {
                return Math.pow(2, zoom);
            },
            apply = function () {
                var t = "scale(" + (mag()) + ") " +
                        "rotate(" + (angle) + ") " +
                        "translate(" + (-x) +
                        " " + y + ")";
                layers.setAttribute("transform", t);
            },
            layers,
            v;

        map.add = function (object) {
            object.map(map);
            return map;
        };

        map.container = function () {
            return container;
        };

        map.layers = function () {
            return layers;
        };

        map.center = function (coordinates) {
            if (!coordinates) {
                return {
                    "x" : x,
                    "y" : y
                };
            } else {
                x = coordinates.x;
                y = coordinates.y;
                apply();
                return map;
            }
        };

        map.panBy = function (delta) {
            map.center({
                "x" : map.center().x - (delta.x / mag()),
                "y" : map.center().y + (delta.y / mag())
            });
        }

        map.zoom = function (level) {
            if (typeof(level) !== "number") {
                return zoom;
            }
            zoom = level;
            apply();
            return map;
        };

        map.zoomBy = function (delta) {
            zoom += delta;
            apply();
            return map;
        };

        // Initialize
        container.setAttribute("width", width);
        container.setAttribute("height", height);
        v = (-width / 2) + " " + (-height / 2) + " " + width + " " + height;
        container.setAttribute("viewBox", v);
        layers = ism.svg("g");
        container.appendChild(layers);
        apply();

        return map;
    };

    return ism;
}(ism));
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
