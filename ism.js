var ism = {};
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
(function (ism) {
    "use strict";

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
        };

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

    ism.svg = function (tag) {
        return document.createElementNS("http://www.w3.org/2000/svg", tag);
    };

    return ism;
}(ism));
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
