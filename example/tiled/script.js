var map = ism.map({
    "container" : ism.svg("svg"),
    "width" : 1200,
    "height": 600,
    "zoomRange": [0,5]
});

// Add container element to the document
document.body.appendChild(map.container());

// Add tiled layer:
var t = ism.tiled({})
map.add(t);

// Add mouse controls
var wheel = ism.wheel(map.container(), map.zoomBy);
var drag = ism.drag(map.container(), map.panBy);

