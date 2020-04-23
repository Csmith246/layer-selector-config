/// <amd-dependency path="esri/core/tsSupport/assignHelper" name="__assign" />
/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/assignHelper", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/core/Accessor", "esri/core/Handles", "esri/core/Collection"], function (require, exports, __assign, __extends, __decorate, decorators_1, Accessor, Handles, Collection) {
    "use strict";
    // Key put on __esri.Sublayer Object which indicates whether that sublayer 
    // should be shown or not in the pick list, based on the geom (and other) filters
    var USE_SUBLAYER_KEY = "USE_SUBLAYER_KEY";
    var LayerConfigViewModel = /** @class */ (function (_super) {
        __extends(LayerConfigViewModel, _super);
        function LayerConfigViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            //----------------------------------
            //
            //  Variables
            //
            //----------------------------------
            _this._handles = new Handles();
            //----------------------------------
            //
            //  expandTracker
            //    Helps keep track of which item is expanded
            //----------------------------------
            _this.expandTracker = new Map();
            _this.supportedLayerTypes = new Collection(["map-image", "feature"]);
            _this.supportedGeomTypes = new Collection(["esriGeometryPoint", "esriGeometryLine", "esriGeometryPolyline", "esriGeometryPolygon"]);
            // supportedGeomTypes: __esri.Collection<string> = new Collection(["esriGeometryLine", "esriGeometryPolyline"]);
            // supportedGeomTypes: __esri.Collection<string> = new Collection(["esriGeometryPolygon"]);
            // supportedGeomTypes: __esri.Collection<string> = new Collection(["esriGeometryPoint"]);
            _this.areLayersDetailsLoading = false;
            _this.acceptableLayers = new Collection();
            _this.selectionType = "single";
            return _this;
        }
        //----------------------------------
        //
        //  Lifecycle methods
        //
        //----------------------------------
        LayerConfigViewModel.prototype.initialize = function () {
            // this._handles.add([
            //   watchUtils.init(this, "searchViewModel.sources", () => {
            //     this.configItems.removeAll();
            //     this._createConfigItems();
            //   })
            // ]);
        };
        LayerConfigViewModel.prototype.loadLayerDetails = function (layers) {
            var _this = this;
            this.areLayersDetailsLoading = true;
            var promCollection = layers.map(function (layer) {
                if (layer.type === "map-image") {
                    return layer.loadAll();
                }
                else {
                    return layer.load();
                }
            });
            Promise.all(promCollection.toArray()).then(function (res) {
                _this.areLayersDetailsLoading = false;
            }).catch(function (err) {
                console.error(err);
                _this.areLayersDetailsLoading = false;
            });
        };
        LayerConfigViewModel.prototype.destroy = function () {
            this._handles.removeAll();
            this._handles.destroy();
            this._handles = null;
        };
        //----------------------------------
        //
        //  Public Methods
        //
        //----------------------------------
        LayerConfigViewModel.prototype.filterByLayerType = function (layer) {
            return this.supportedLayerTypes.includes(layer.type);
        };
        LayerConfigViewModel.prototype.filterByGeomType = function (layer) {
            var _this = this;
            if (layer.type === "map-image") {
                var passingCount_1 = 0;
                layer.allSublayers.forEach(function (sublayer) {
                    var isSublayerPassing = _this.supportedGeomTypes.includes(sublayer.sourceJSON["geometryType"]);
                    sublayer[USE_SUBLAYER_KEY] = isSublayerPassing;
                    if (isSublayerPassing)
                        passingCount_1 += 1;
                });
                return passingCount_1 > 0; // if any sublayers pass, then don't filter the MIL out of the display
            }
            return this.supportedGeomTypes.includes(layer["sourceJSON"]["geometryType"]);
        };
        __decorate([
            decorators_1.property() // itemID => isExpanded
        ], LayerConfigViewModel.prototype, "expandTracker", void 0);
        __decorate([
            decorators_1.property()
        ], LayerConfigViewModel.prototype, "supportedLayerTypes", void 0);
        __decorate([
            decorators_1.property()
        ], LayerConfigViewModel.prototype, "supportedGeomTypes", void 0);
        __decorate([
            decorators_1.property({
                type: Boolean
            })
        ], LayerConfigViewModel.prototype, "areLayersDetailsLoading", void 0);
        __decorate([
            decorators_1.property({
                type: Collection
            })
        ], LayerConfigViewModel.prototype, "acceptableLayers", void 0);
        __decorate([
            decorators_1.property()
        ], LayerConfigViewModel.prototype, "selectionType", void 0);
        LayerConfigViewModel = __decorate([
            decorators_1.subclass("LayerConfigViewModel")
        ], LayerConfigViewModel);
        return LayerConfigViewModel;
    }(decorators_1.declared(Accessor)));
    return LayerConfigViewModel;
});
// export = {
//   LayerConfigViewModel: LayerConfigViewModel,
//   USE_SUBLAYER_KEY: USE_SUBLAYER_KEY
// };
//# sourceMappingURL=LayerConfigViewModel.js.map