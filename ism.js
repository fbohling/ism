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

    ism.event = function (that) {
        var types = {};

        that.on = function (type, handler) {
            if (types.hasOwnProperty(type)) {
                types[type].push(handler);
            } else {
                types[type] = [handler];
            }
        };

        that.off = function (type, handler) {
            if (types.hasOwnProperty(type)) {
                // Create new type array without given handler
                types[type] = types[type].filter(function (x) {
                    return (x === handler ? false : true);
                });
            }
        };

        that.trigger = function (type) {
            if (types.hasOwnProperty(type)) {
                // fire all functions in types[type]
                types[type].map(function (x) {
                    x();
                });
            }
        };

        that.types = types;
    };

    return ism;
}(ism));
(function (ism) {
    "use strict";

    ism.image = function (spec) {
        var image = {},
            width = spec.width || 256,
            height = spec.height || 256,
            x = spec.x || 0,
            // negate spec.y to make the y axis point up
            y = -spec.y || 0,
            url = spec.url,
            clazz = spec.class || "",
            element = ism.svg("image"),
            map;

        element.setAttribute("width", width);
        element.setAttribute("height", height);
        element.setAttribute("x", x - (width / 2));
        element.setAttribute("y", y - (height / 2));
        element.setAttribute("class", clazz);
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

        // add event handling methods
        ism.event(map);

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
            var p = ism.point(delta),
                m = layers.getCTM().inverse();
            // Set translation to 0
            m.e = 0;
            m.f = 0;
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
            map.trigger("zoom");
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

    ism.tiled = function (spec) {
        var tiled = {},
            width = spec.width || 256,
            height = spec.height || 256,
            x = spec.x || 0,
            // negate spec.y to make the y axis point up
            y = -spec.y || 0,
            clazz = spec.class || "",
            element = ism.svg("svg"),
            tiles = [],
            draw = function () {
                var divs = Math.pow(2, zoom),
                    line = "",
                    size = width,
                    r,
                    x,
                    y;

                // delete old tiles
                tiles.map(function (t) {
                        t.parentNode.removeChild(t);
                    });
                tiles = [];

                // draw
                for (y = 0; y < divs; y += 1) {
                    for (x = 0; x < divs; x += 1) {
                        r = ism.svg("rect");
                        r.setAttribute("x", x * size / divs);
                        r.setAttribute("y", y * size / divs);
                        r.setAttribute("width", (size - 1) / divs);
                        r.setAttribute("height", (size - 1) / divs);
                        element.appendChild(r);
                        tiles.push(r);
                    }
                }
            },
            map,
            zoom;

        element.setAttribute("width", width);
        element.setAttribute("height", height);
        element.setAttribute("x", x - (width / 2));
        element.setAttribute("y", y - (height / 2));
        element.setAttribute("class", clazz);

        tiled.map = function (m) {
            if (arguments.length === 0) {
                return map;
            }
            m.layers().appendChild(element);
            map = m;
            map.on("zoom", tiled.update);
            tiled.update();
            return tiled;
        };

        tiled.update = function () {
            var z = Math.round(map.zoom());
            if (z !== zoom) {
                zoom = z;
                draw();
            }
            return tiled;
        };

        return tiled;
    };

    return ism;
}(ism));
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
(function (ism) {
    "use strict";

    ism.vector = function (spec) {
        var width = spec.width || 256,
            height = spec.height || 256,
            x = spec.x || 0,
            // negate spec.y to make the y axis point up
            y = -spec.y || 0,
            url = spec.url,
            clazz = spec.class || "",
            element = ism.svg("svg"),
            vector = {},
            onComplete = function (responseElement) {
                responseElement.setAttribute("x", x - (width / 2));
                responseElement.setAttribute("y", y - (height / 2));
                responseElement.setAttribute("width", width);
                responseElement.setAttribute("height", height);
                responseElement.setAttribute("class", clazz);
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
