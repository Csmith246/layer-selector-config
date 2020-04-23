require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/Search",
    "esri/portal/Portal",
    "esri/layers/FeatureLayer",
    "esri/core/watchUtils",
    "esri/widgets/Home",
    "esri/core/Handles",
    "widgets/LayerConfig",
    "dojo/domReady!"
], function (WebMap, MapView, Search, Portal, FeatureLayer, watchUtils, Home, Handles, LayerConfig) {
    console.log("INIT IN MAIN");
    var map = new WebMap({
        portalItem: {
            // id: "34beb6ccb9e74bbf8641dea2e8cb8b37"
            // id: "6712da5c872c44deaf24499e6f6c2d2b"
            id: "ba6be27ea6df4edcbef7028b6f481cc4"
        }
    });
    var view = new MapView({
        map: map,
        container: "viewDiv"
    });
    view.when(function () {
        var layerConfig = new LayerConfig({
            container: "configPanel",
            loadedWebMap: map
        });
    });
});
//# sourceMappingURL=Main.js.map