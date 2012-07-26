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

// TODO: Controls
// Add a mousewheel control (Not implemented yet)
// map.add(ism.wheel(map.zoomBy))

// TODO: Indicators
