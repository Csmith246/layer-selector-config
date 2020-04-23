/// <amd-dependency path="esri/core/tsSupport/assignHelper" name="__assign" />
/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

// esri.core.accessorSupport
import {
  subclass,
  declared,
  property
} from "esri/core/accessorSupport/decorators";

// esri.core
import Accessor = require("esri/core/Accessor");

// esri.core.Handles
import Handles = require("esri/core/Handles");

// esri.core.Collection
import Collection = require("esri/core/Collection");

// Key put on __esri.Sublayer Object which indicates whether that sublayer 
// should be shown or not in the pick list, based on the geom (and other) filters
const USE_SUBLAYER_KEY = "USE_SUBLAYER_KEY";

@subclass("LayerConfigViewModel")
class LayerConfigViewModel extends declared(Accessor) {
  //----------------------------------
  //
  //  Variables
  //
  //----------------------------------
  private _handles: Handles = new Handles();

  //----------------------------------
  //
  //  expandTracker
  //    Helps keep track of which item is expanded
  //----------------------------------
  @property() // itemID => isExpanded
  expandTracker: Map<string, boolean> = new Map<string, boolean>();

  @property()
  supportedLayerTypes: __esri.Collection<string> = new Collection(["map-image", "feature"]);

  @property()
  supportedGeomTypes: __esri.Collection<string> = new Collection(["esriGeometryPoint", "esriGeometryLine", "esriGeometryPolyline", "esriGeometryPolygon"]);
  // supportedGeomTypes: __esri.Collection<string> = new Collection(["esriGeometryLine", "esriGeometryPolyline"]);
  // supportedGeomTypes: __esri.Collection<string> = new Collection(["esriGeometryPolygon"]);
  // supportedGeomTypes: __esri.Collection<string> = new Collection(["esriGeometryPoint"]);

  @property({
    type: Boolean
  })
  areLayersDetailsLoading = false;

  @property({
    type: Collection
  })
  acceptableLayers: __esri.Collection<__esri.Layer> = new Collection();

  @property()
  selectionType: "single" | "multi" = "single";

  //----------------------------------
  //
  //  Lifecycle methods
  //
  //----------------------------------
  initialize() {
    // this._handles.add([
    //   watchUtils.init(this, "searchViewModel.sources", () => {
    //     this.configItems.removeAll();
    //     this._createConfigItems();
    //   })
    // ]);
  }

  loadLayerDetails(layers: __esri.Collection<__esri.Layer>) {
    this.areLayersDetailsLoading = true;
    let promCollection = layers.map((layer: __esri.Layer) => {
      if(layer.type === "map-image"){
        return (<__esri.MapImageLayer>layer).loadAll();
      }else{
        return layer.load();
      }
    });

    Promise.all(promCollection.toArray()).then((res) => {
      this.areLayersDetailsLoading = false;
    }).catch((err) => {
      console.error(err);
      this.areLayersDetailsLoading = false;
    });
  }

  destroy() {
    this._handles.removeAll();
    this._handles.destroy();
    this._handles = null;
  }

  //----------------------------------
  //
  //  Public Methods
  //
  //----------------------------------

  filterByLayerType(layer: __esri.Layer): boolean {
    return this.supportedLayerTypes.includes(layer.type);
  }

  filterByGeomType(layer: __esri.Layer): boolean {
    if (layer.type === "map-image"){
      let passingCount = 0;
      (<__esri.MapImageLayer>layer).allSublayers.forEach((sublayer)=>{
        let isSublayerPassing:boolean = this.supportedGeomTypes.includes(sublayer.sourceJSON["geometryType"]);
        sublayer[USE_SUBLAYER_KEY] = isSublayerPassing;
        if(isSublayerPassing) passingCount += 1;
      });

      return passingCount > 0; // if any sublayers pass, then don't filter the MIL out of the display
    }
    return this.supportedGeomTypes.includes(layer["sourceJSON"]["geometryType"]);
  }

}

export = LayerConfigViewModel;
// export = {
//   LayerConfigViewModel: LayerConfigViewModel,
//   USE_SUBLAYER_KEY: USE_SUBLAYER_KEY
// };
