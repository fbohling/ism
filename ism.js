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
            x = spec.x || -(width / 2),
            // negate spec.y to make the y axis point up
            y = -spec.y || -(height / 2),
            element = ism.svg("image"),
            map;

        element.setAttribute("width", width);
        element.setAttribute("height", height);
        // Center around 0,0
        element.setAttribute("x", x);
        element.setAttribute("y", y);
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
            zoomRange = spec.zoomRange || [0, 10],
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
            layers;

        map.add = function (object) {
            object.map(map);
            return map;
        };

        map.angle = function (deg) {
            if (typeof(deg) !== "number") {
                return angle;
            } else {
                angle = deg;
                apply();
            }
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
            // Get the inversed transformation matrix of the layer element
            // to transform between the layers and screen coordinate systems.
            var p = container.createSVGPoint(),
                m = layers.getCTM().inverse();
            // Set translation to 0
            m.e = 0;
            m.f = 0;
            // Set up p
            p.x = delta.x;
            p.y = delta.y;
            // transform p with m
            p = p.matrixTransform(m);
            // Recenter map
            map.center({
                "x" : map.center().x - (p.x),
                "y" : map.center().y + (p.y)
            });
        };

        map.zoom = function (level) {
            if (typeof(level) !== "number") {
                return zoom;
            }
            //Keep level inside the zoomRange
            level = level < zoomRange[0] ? zoomRange[0] : level;
            level = level > zoomRange[1] ? zoomRange[1] : level;

            zoom = level;
            apply();
            return map;
        };

        map.zoomBy = function (delta, point) {
            var z = zoom,
                panDist;
            map.zoom(zoom + delta);
            // Pan around point, if defined
            if (typeof(point) === "object") {
                // Recalculate delta, in case map.zoom hit a constraint
                delta = zoom - z;
                panDist = function (a) {
                    return -(a * (Math.pow(2, delta) - 1));
                };
                map.panBy({"x": panDist(point.x), "y": panDist(point.y)});
            }
            return map;
        };

        // Initialize
        container.setAttribute("width", width);
        container.setAttribute("height", height);
        container.setAttribute("viewBox",
            (-width / 2) + " " + (-height / 2) + " " + width + " " + height);
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

    ism.vector = function (spec) {
        var width = spec.width || 256,
            height = spec.height || 256,
            url = spec.url,
            x = spec.x || -(width / 2),
            // negate spec.y to make the y axis point up
            y = -spec.y || -(height / 2),
            element = ism.svg("svg"),
            vector = {},
            onComplete = function (responseElement) {
                responseElement.setAttribute("x", x);
                responseElement.setAttribute("y", y);
                responseElement.setAttribute("width", width);
                responseElement.setAttribute("height", height);
                element.parentNode.replaceChild(responseElement, element);
            },
            callback,
            map,
            request;

        // FIXME: AJAX code was stuffed here,
        // though it belongs into it's own function
        // check if XMLHttpRequest() is available
        if (window.XMLHttpRequest) {

            // this closure is used to make the requests thread safe
            callback = function () {
                // when the transaction is complete, call onComplete
                if (request.readyState === 4 && request.status === 200) {
                    onComplete(request.responseXML.documentElement);
                }
            };
            request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.onreadystatechange = callback;
            request.send(null);
        }

        vector.map = function (m) {
            if (arguments.length === 0) {
                return map;
            }
            m.layers().appendChild(element);
            map = m;
            return vector;
        };

        return vector;
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
