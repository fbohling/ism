(function (ism) {
    "use strict";

    ism.map = function (spec) {
        var map = {},
            container = spec.container,
            zoom = 0,
            viewBox = function (newVB) {
                if (!newVB) {
                    var contVB = container.getAttribute("viewBox")
                            .split(" ").map(parseFloat);
                    return {
                        "x" : contVB[0],
                        "y" : contVB[1],
                        "width" : contVB[2],
                        "height" : contVB[3]
                    };
                } else {
                    container.setAttributeNS(null, "viewBox",
                    newVB.x + " " + newVB.y + " " +
                    newVB.width + " " + newVB.height);
                }
            },
            clientRect = function () {
                return container.getClientRects()[0];
            };


        map.add = function (object) {
            object.map(map);
            return map;
        };

        map.container = function () {
            return container;
        };

        map.center = function (coordinates) {
            if (!coordinates) {
                return {
                    "x" : (viewBox().x + viewBox().width / 2),
                    "y" : -(viewBox().y + viewBox().height / 2)
                };
            } else {
                viewBox({
                    "x" : coordinates.x - viewBox().width / 2,
                    "y" : -coordinates.y - viewBox().height / 2,
                    "width" : viewBox().width,
                    "height" : viewBox().height
                });
            }
        };

        map.resize = function () {
            viewBox({x : 0, y : 0, width : clientRect().width, height : clientRect().height});
        };

        map.zoom = function (level) {
            if (typeof(level) !== "number") {
                return zoom;
            }
            var mag = Math.pow(2, level),
                width = clientRect().width * (1 / mag),
                height = clientRect().height * (1 / mag);
            zoom = level;
            viewBox({
                "x" : map.center().x - width / 2, 
                "y" : -map.center().y - height / 2,
                "width" : width,
                "height" : height
            });
            return map;
        };

        // resize map after creation
        map.resize();

        return map;
    };

    return ism;
}(ism));
