// Create a container element
var container = ism.svg("svg");

// Add the container to the document
document.documentElement.appendChild(container);

// Create a map with the container
var map = ism.map({"container" : container});

// Create a layer and add it to the map
var layer = ism.image({"url" : "blue-marble.jpg"});
map.add(layer);
