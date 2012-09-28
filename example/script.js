// To create a map instance, we have to call the `ism.map` constructor.
// As all constructors of ism are in fact object factories, we don't have to
// write `new` each time we call a constructor:
var map = ism.map({
    "container" : ism.svg("svg"),
    "width" : 800,
    "height": 450
});
// ism.map takes an JavaScript object as a parameter, that contains specs
// for the map. Here we create a new `SVGSVGElement` to use it as the map
// container, by calling the `ism.svg` convinience method. Also, we have to
// specify a width and a height in pixels, so that the map knows, what the size
// the map inside the document should be.

// Now we can add the container element, that we have just created, to our
// document:
document.body.appendChild(map.container());

// To show some data on the map, we have to add a layer:
map.add(ism.image({"url" : "blue-marble.jpg"}));
// `ism.image` creates a simple layer, consisting of a plain image.
// As before we provide specs to the image layer constructor as an object
// literal, which in this case holds the image's url.

// Add a push pin as a vector layer. Additionally we provide the pin's
// width and height
map.add(ism.vector({"url" : "pin.svg", "width": 16, "height": 27}));

// So far, we can only display data because ism is non-interactive by default.
// To make the map interactive we have to add some controls.

// To add a mouse wheel control, call the ism.wheel constructor and hand the
// element to observe and a function to call when the mouse wheel was turned.
// From now on, every mouse wheel turn will zoom the map.
var wheel = ism.wheel(map.container(), map.zoomBy);

// In the same manner, we create a mouse drag listener to pan the map.
var drag = ism.drag(map.container(), map.panBy);

// Of course you can also manipulate the map programatically. To rotate the
// map, call map.angle with the desired angle in degrees.
map.angle(60);
