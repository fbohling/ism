(function (ism) {
    "use strict";

    ism.vector = function (spec) {
        var width = spec.width || 256,
            height = spec.height || 256,
            url = spec.url,
            element = ism.svg("svg"),
            vector = {},
            onComplete = function (responseElement) {
                responseElement.setAttribute("x", -(width / 2));
                responseElement.setAttribute("y", -(height / 2));
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
