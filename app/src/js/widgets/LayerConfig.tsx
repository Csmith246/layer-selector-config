/// <amd-dependency path="esri/core/tsSupport/assignHelper" name="__assign" />
/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />

// esri.core.accessorSupport
import {
  subclass,
  declared,
  property,
  aliasOf
} from "esri/core/accessorSupport/decorators";

//esri.widgets.support
import {
  renderable,
  tsx,
  accessibleHandler
} from "esri/widgets/support/widget";

// dojo.118n
// import i18n = require("dojo/i18n!./SearchConfig/nls/resources");

// esri.widgets.Widget
import Widget = require("esri/widgets/Widget");

// esri.core.Collection
import Collection = require("esri/core/Collection");

// esri.core.watchUtils
import watchUtils = require("esri/core/watchUtils");

// esri/WebMap
import WebMap = require("esri/WebMap");

// esri/Layer
import Layer = require("esri/layers/Layer");

// widgets/LayerConfigViewModel
import LayerConfigViewModel = require("./LayerConfigViewModel");

// import LCViewModelExport = require("./LayerConfigViewModel");
// const LayerConfigViewModel = LCViewModelExport.LayerConfigViewModel;
// const USE_SUBLAYER_KEY = LCViewModelExport.USE_SUBLAYER_KEY;

// import USE_SUBLAYER_KEY = require("./LayerConfigViewModel");

const USE_SUBLAYER_KEY = "USE_SUBLAYER_KEY";

//----------------------------------
//
//  CSS Classes
//esri-search-config__source-list-table
//----------------------------------
const CSS = {
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

@subclass("LayerConfig")
class LayerConfig extends declared(Widget) {
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
  @renderable([
    "viewModel.acceptableLayers"
  ])
  @property({
    type: LayerConfigViewModel
  })
  viewModel: LayerConfigViewModel = new LayerConfigViewModel();


  @renderable()
  loadedWebMap: WebMap = null;

  @aliasOf("viewModel.areLayersDetailsLoading")
  @property()
  @renderable()
  areLayersDetailsLoading: boolean;


  //----------------------------------
  //
  //  Lifecycle methods
  //
  //----------------------------------
  constructor(value: any) {
    super(value);
    console.log("constructor:", value);
    console.log("loadedWM Constructor:", this.loadedWebMap);
  }

  postInitialize() {
    console.log("loadedWM PostINitialize:", this.loadedWebMap);

    let acceptableLayers: __esri.Collection<__esri.Layer> = this.loadedWebMap.layers
      .filter(this.viewModel.filterByLayerType.bind(this.viewModel));

    this.viewModel.loadLayerDetails(acceptableLayers);

    watchUtils.whenFalseOnce(this.viewModel, "areLayersDetailsLoading", ()=>{
      let finalAcceptableLayers = acceptableLayers.filter(this.viewModel.filterByGeomType.bind(this.viewModel));
      this.viewModel.acceptableLayers = finalAcceptableLayers;
    });

  }

  render() {
    console.log("loadedWM render:", this.loadedWebMap);

    return (
      <div class={this.classes(CSS.base, CSS.flexContainer)}>
        <header>Pick Layer to use:</header>{/* todo: nls */}
        {this._renderLayerItems()}
      </div>
    );
  }
  //----------------------------------
  //
  //  Public Methods
  //
  //----------------------------------

  // toJSON
  @aliasOf("viewModel.toJSON")
  toJSON: () => void;


  //----------------------------------
  //
  //  Private Methods
  //
  //----------------------------------

  private _renderLayerItems(){
    if(this.areLayersDetailsLoading){
      return <div>Loading...</div>;
    }else{
      let arr = this.viewModel.acceptableLayers.map((layer, sourceItemIndex)=>{
        let returnedArr = this._renderLayerItem(layer, sourceItemIndex);
        return returnedArr;
      })
      .toArray();
  
      return arr.length > 0 ? arr : <div>No acceptable layers exist in Webmap</div>;
      // return <div>No acceptable layers exist in Webmap</div>;

    }
  }

  private _renderLayerItem(
    layer: Layer,
    sourceItemIndex: number
  ): any {
    // this._checkSearchFields();
    // const layerItem = sourceItem as LayerConfigItem;
    let divKey = `${layer.title}_${layer.id}`;

    return (
      <div class={CSS.flexLayerRow} key={divKey}>

        {/* Decide which layer type to render */}
        { layer.type === "feature" ?
            this._renderFeatureLayerItem(layer as any, sourceItemIndex) :
          layer.type === "map-image" ?
            this._renderMapImageItem(layer as any, sourceItemIndex) :
          this._renderDefaultItem(layer)
        }
        
      </div>
    );
  }

  private _renderFeatureLayerItem(layer : __esri.FeatureLayer, sourceItemIndex: number): any{
    let id = `${layer.title}_${sourceItemIndex}`;
    return (
      <label for={id} class={ CSS.selectableLayerItemStyle } >
        { this._decideSelectionType(id) }
        <span class={ CSS.calciteStyles.featureLayerIcon }/>
        <span>{ layer.title }</span>
      </label>
    );
  }

  private _renderMapImageItem(layer : __esri.MapImageLayer, sourceItemIndex: number): any{
    let key: string = `itemAt${sourceItemIndex}`
    let isExpanded: boolean = this.viewModel.expandTracker.get(key);
    if(isExpanded == null){ // initialize item expand Tracking if not already
      this.viewModel.expandTracker.set(key, false);
    }
    return (
      <div>
        <div 
          class={this.classes(CSS.flexLayerRow, CSS.dropdownLayerItemStyle)} 
          onclick={this._handleExpandClick.bind(this, key, sourceItemIndex)}
          >
          <span class={isExpanded ? CSS.calciteStyles.downTriangleIcon : CSS.calciteStyles.rightTriangleIcon} />
          <span class={CSS.calciteStyles.mapImageLayerIcon} />
          <span>{layer.title}</span>
        </div>
        <div class={isExpanded ? CSS.sublayerDisplay : CSS.displayNone}>
          {this._renderSublayerItems(layer)}
        </div>
      </div>
    );
  }

  private _handleExpandClick(key: string, index: number){
    this.viewModel.expandTracker.set(key, !this.viewModel.expandTracker.get(key));
  }

  private _renderSublayerItems(layer: __esri.MapImageLayer){
    let res = layer.allSublayers
      .filter(sublayer => sublayer[USE_SUBLAYER_KEY]) // NOTE: USE_SUBLAYER_KEY Prop populated by filterByGeomType
      .map(sublayer => this._renderSublayerItem(sublayer));
    return res.toArray();
  }

  private _renderSublayerItem(sublayer: __esri.Sublayer){
    let divKey = `${sublayer.layer.title}_${sublayer.id}`;
    return (
      <label for={divKey} class={ CSS.selectableLayerItemStyle } key={divKey}>
        { this._decideSelectionType(divKey) }
        <span class={ CSS.calciteStyles.featureLayerIcon }/>
        <span>{ sublayer.title }</span>
      </label>
    );
  }

  private _renderDefaultItem(layer: Layer){
    
  }

  private _decideSelectionType(id: string){
    return this.viewModel.selectionType === "single" ? this._renderRadioBtn(id) : this._renderCheckBox(id);
  }

  // Render Form Components
  private _renderRadioBtn(id: string){
    return (
      <input
      bind={this}
      id={id}
      class={CSS.radioBtns}
      // onclick={this._handleExistingSourceType}
      // onkeydown={this._handleExistingSourceType}
      // tabIndex={0}
      name="radioSelection"
      type="radio"
      // checked={this._addExistingType}
      source-type="url"
    />
    );
  }

  private _renderCheckBox(id: string){
    return (
      <input
      bind={this}
      id={id}
      // onchange={this.viewModel.modifyLayerMap}
      type="checkbox"
      name="checkboxSelection"
      // checked={this.viewModel.layerItemToBeConfigured.withinViewEnabled}
    />
    );
  }


/***
 * TODO:
 * 
 * Tuesday:
 * 1. [X] Work out a basic display for Feature Layers and Map Image Layers (showing all sublayers for map image)
 * 2. [X] Work out the filtering based on Layer Type and Geom Type - (display what the layer and Geom types are?)
 *      [X] map-image and feature
 *      [X] point, polyline, polygon... etc
 * 
 * 
 * 
 * 2.5. [ ] Idea to give visual indication of what the filters are that are being applied
 * 
 * 3. [X] Work on selection with checkboxes and radio btns
 *    [ ] Capture selection
 * 4. [ ] Work on Field Presentation and Selection
 * 5. [ ] Work on output json
 * 
 */

}

export = LayerConfig;
