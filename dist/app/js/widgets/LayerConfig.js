/// <amd-dependency path="esri/core/tsSupport/assignHelper" name="__assign" />
/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
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
define(["require", "exports", "esri/core/tsSupport/assignHelper", "esri/core/tsSupport/declareExtendsHelper", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget", "esri/widgets/Widget", "esri/core/watchUtils", "./LayerConfigViewModel"], function (require, exports, __assign, __extends, decorators_1, widget_1, Widget, watchUtils, LayerConfigViewModel) {
    "use strict";
    // import LCViewModelExport = require("./LayerConfigViewModel");
    // const LayerConfigViewModel = LCViewModelExport.LayerConfigViewModel;
    // const USE_SUBLAYER_KEY = LCViewModelExport.USE_SUBLAYER_KEY;
    // import USE_SUBLAYER_KEY = require("./LayerConfigViewModel");
    var USE_SUBLAYER_KEY = "USE_SUBLAYER_KEY";
    //----------------------------------
    //
    //  CSS Classes
    //esri-search-config__source-list-table
    //----------------------------------
    var CSS = {
        base: "esri-layer-picker-config",
        flexContainer: "esri-layer-picker-config__flex-display",
        flexLayerRow: "esri-layer-picker-config__flex-layer-row",
        displayNone: "display-none",
        sublayerDisplay: "esri-layer-picker-config__sublayer-display",
        dropdownLayerItemStyle: "esri-layer-picker-config__dropdown-layer",
        selectableLayerItemStyle: "esri-layer-picker-config__selectable-layer",
        radioBtns: "esri-layer-picker-config__radio-btns",
        calciteStyles: {
            alert: "alert",
            alertYellow: "alert-yellow",
            modifierClass: "modifier-class",
            isActive: "is-active",
            button: "btn",
            largeButton: "btn-large",
            greenButton: "btn-green",
            redButton: "btn-red",
            clearButton: "btn-clear",
            locatorIcon: "icon-ui-locate",
            mapImageLayerIcon: "icon-ui-layers",
            featureLayerIcon: "icon-ui-feature-layer",
            rightTriangleIcon: "icon-ui-right-triangle-arrow",
            downTriangleIcon: "icon-ui-down-arrow",
            warningIcon: "icon-ui-error2"
        }
    };
    var LayerConfig = /** @class */ (function (_super) {
        __extends(LayerConfig, _super);
        //----------------------------------
        //
        //  Lifecycle methods
        //
        //----------------------------------
        function LayerConfig(value) {
            var _this = _super.call(this, value) || this;
            //----------------------------------
            //
            //  Variables
            //
            //----------------------------------
            // //----------------------------------
            // //
            // //  configItems
            // //
            // //----------------------------------
            // @aliasOf("viewModel.configItems")
            // @renderable()
            // configItems: Collection<LocatorConfigItem | LayerConfigItem> = null;
            //----------------------------------
            //
            //  viewModel
            //
            //----------------------------------
            _this.viewModel = new LayerConfigViewModel();
            _this.loadedWebMap = null;
            console.log("constructor:", value);
            console.log("loadedWM Constructor:", _this.loadedWebMap);
            return _this;
        }
        LayerConfig.prototype.postInitialize = function () {
            var _this = this;
            console.log("loadedWM PostINitialize:", this.loadedWebMap);
            var acceptableLayers = this.loadedWebMap.layers
                .filter(this.viewModel.filterByLayerType.bind(this.viewModel));
            this.viewModel.loadLayerDetails(acceptableLayers);
            watchUtils.whenFalseOnce(this.viewModel, "areLayersDetailsLoading", function () {
                var finalAcceptableLayers = acceptableLayers.filter(_this.viewModel.filterByGeomType.bind(_this.viewModel));
                _this.viewModel.acceptableLayers = finalAcceptableLayers;
            });
        };
        LayerConfig.prototype.render = function () {
            console.log("loadedWM render:", this.loadedWebMap);
            return (widget_1.tsx("div", { class: this.classes(CSS.base, CSS.flexContainer) },
                widget_1.tsx("header", null, "Pick Layer to use:"),
                this._renderLayerItems()));
        };
        //----------------------------------
        //
        //  Private Methods
        //
        //----------------------------------
        LayerConfig.prototype._renderLayerItems = function () {
            var _this = this;
            if (this.areLayersDetailsLoading) {
                return widget_1.tsx("div", null, "Loading...");
            }
            else {
                var arr = this.viewModel.acceptableLayers.map(function (layer, sourceItemIndex) {
                    var returnedArr = _this._renderLayerItem(layer, sourceItemIndex);
                    return returnedArr;
                })
                    .toArray();
                return arr.length > 0 ? arr : widget_1.tsx("div", null, "No acceptable layers exist in Webmap");
                // return <div>No acceptable layers exist in Webmap</div>;
            }
        };
        LayerConfig.prototype._renderLayerItem = function (layer, sourceItemIndex) {
            // this._checkSearchFields();
            // const layerItem = sourceItem as LayerConfigItem;
            var divKey = layer.title + "_" + layer.id;
            return (widget_1.tsx("div", { class: CSS.flexLayerRow, key: divKey }, layer.type === "feature" ?
                this._renderFeatureLayerItem(layer, sourceItemIndex) :
                layer.type === "map-image" ?
                    this._renderMapImageItem(layer, sourceItemIndex) :
                    this._renderDefaultItem(layer)));
        };
        LayerConfig.prototype._renderFeatureLayerItem = function (layer, sourceItemIndex) {
            var id = layer.title + "_" + sourceItemIndex;
            return (widget_1.tsx("label", { for: id, class: CSS.selectableLayerItemStyle },
                this._decideSelectionType(id),
                widget_1.tsx("span", { class: CSS.calciteStyles.featureLayerIcon }),
                widget_1.tsx("span", null, layer.title)));
        };
        LayerConfig.prototype._renderMapImageItem = function (layer, sourceItemIndex) {
            var key = "itemAt" + sourceItemIndex;
            var isExpanded = this.viewModel.expandTracker.get(key);
            if (isExpanded == null) { // initialize item expand Tracking if not already
                this.viewModel.expandTracker.set(key, false);
            }
            return (widget_1.tsx("div", null,
                widget_1.tsx("div", { class: this.classes(CSS.flexLayerRow, CSS.dropdownLayerItemStyle), onclick: this._handleExpandClick.bind(this, key, sourceItemIndex) },
                    widget_1.tsx("span", { class: isExpanded ? CSS.calciteStyles.downTriangleIcon : CSS.calciteStyles.rightTriangleIcon }),
                    widget_1.tsx("span", { class: CSS.calciteStyles.mapImageLayerIcon }),
                    widget_1.tsx("span", null, layer.title)),
                widget_1.tsx("div", { class: isExpanded ? CSS.sublayerDisplay : CSS.displayNone }, this._renderSublayerItems(layer))));
        };
        LayerConfig.prototype._handleExpandClick = function (key, index) {
            this.viewModel.expandTracker.set(key, !this.viewModel.expandTracker.get(key));
        };
        LayerConfig.prototype._renderSublayerItems = function (layer) {
            var _this = this;
            var res = layer.allSublayers
                .filter(function (sublayer) { return sublayer[USE_SUBLAYER_KEY]; }) // NOTE: USE_SUBLAYER_KEY Prop populated by filterByGeomType
                .map(function (sublayer) { return _this._renderSublayerItem(sublayer); });
            return res.toArray();
        };
        LayerConfig.prototype._renderSublayerItem = function (sublayer) {
            var divKey = sublayer.layer.title + "_" + sublayer.id;
            return (widget_1.tsx("label", { for: divKey, class: CSS.selectableLayerItemStyle, key: divKey },
                this._decideSelectionType(divKey),
                widget_1.tsx("span", { class: CSS.calciteStyles.featureLayerIcon }),
                widget_1.tsx("span", null, sublayer.title)));
        };
        LayerConfig.prototype._renderDefaultItem = function (layer) {
        };
        LayerConfig.prototype._decideSelectionType = function (id) {
            return this.viewModel.selectionType === "single" ? this._renderRadioBtn(id) : this._renderCheckBox(id);
        };
        // Render Form Components
        LayerConfig.prototype._renderRadioBtn = function (id) {
            return (widget_1.tsx("input", { bind: this, id: id, class: CSS.radioBtns, 
                // onclick={this._handleExistingSourceType}
                // onkeydown={this._handleExistingSourceType}
                // tabIndex={0}
                name: "radioSelection", type: "radio", "source-type": "url" }));
        };
        LayerConfig.prototype._renderCheckBox = function (id) {
            return (widget_1.tsx("input", { bind: this, id: id, 
                // onchange={this.viewModel.modifyLayerMap}
                type: "checkbox", name: "checkboxSelection" }));
        };
        __decorate([
            widget_1.renderable([
                "viewModel.acceptableLayers"
            ]),
            decorators_1.property({
                type: LayerConfigViewModel
            })
        ], LayerConfig.prototype, "viewModel", void 0);
        __decorate([
            widget_1.renderable()
        ], LayerConfig.prototype, "loadedWebMap", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.areLayersDetailsLoading"),
            decorators_1.property(),
            widget_1.renderable()
        ], LayerConfig.prototype, "areLayersDetailsLoading", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.toJSON")
        ], LayerConfig.prototype, "toJSON", void 0);
        LayerConfig = __decorate([
            decorators_1.subclass("LayerConfig")
        ], LayerConfig);
        return LayerConfig;
    }(decorators_1.declared(Widget)));
    return LayerConfig;
});
//# sourceMappingURL=LayerConfig.js.map