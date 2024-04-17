L.Map.include({
  hasControl: function (control) {
    for (var i in this._controlCorners) {
      if (this._controlCorners[i].contains(control.getContainer())) {
        return true;
      }
    }
    return false;
  },
});

var baseMaps = {
  'Google Maps': L.tileLayer(
    'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '© Google',
    }
  ),

  'Google Satellite': L.tileLayer(
    'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '© Google',
    }
  ),

  'Google Traffic': L.tileLayer(
    'https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}',
    {
      maxZoom: 20,
      minZoom: 2,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '© Google',
    }
  ),

  OpenStreetMap: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
  }),

  'OpenStreetMap.HOT': L.tileLayer(
    'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    {
      maxZoom: 19,
      attribution:
        '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France',
    }
  ),

  OpenTopoMap: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)',
  }),
};

var layerControls = {
  layerControler: null,

  layers: [
    'Google Maps',
    'Google Traffic',
    'Google Satellite',
    'OpenStreetMap',
    'OpenStreetMap.HOT',
    'OpenTopoMap',
  ],

  default: 'Google Maps',

  addDefault: function (map) {
    var defaultLayer = layerControls.default;

    baseMaps[defaultLayer].addTo(map);
  },

  getDefault: function () {
    return layerControls.default;
  },

  deleteLayer: function (layer, map) {
    if (!baseMaps[layer]) {
      throw new Error(`The layer ${layer} does not exist.`);
    }
    delete baseMaps[layer];
    var index = layerControls.layers.indexOf(layer);
    if (index > -1) {
      layerControls.layers.splice(index, 1);
    }

    if (
      layerControls.layerControler &&
      map.hasControl(layerControls.layerControler)
    ) {
      layerControls.addLayersControler(map);
    }
  },
  createLayer: function (name, url, options) {
    if (baseMaps[name]) {
      throw new Error(`A layer with the name ${name} already exists.`);
    }
    var newLayer = L.tileLayer(url, options);

    baseMaps[name] = newLayer;

    layerControls.layers.push(baseMaps.name);
  },

  changeDefault: function (layer, apply, map) {
    layerControls.default = layer;

    if (apply) {
      layerControls.changeLayer(map, layerControls.default);
    }
  },

  getLayers: function () {
    return layerControls.layers;
  },

  changeLayer: function (map, layer) {
    if (!layerControls.layers.includes(layer)) {
      throw new Error(`Unable to change to ${layer} because it doesn't exist`);
    }

    for (var layers in baseMaps) {
      if (map.hasLayer(baseMaps[layers])) {
        map.removeLayer(baseMaps[layers]);
      }
    }
    baseMaps[layer].addTo(map);
  },

  removeLayersControler: function () {
    if (layerControls.layerControler) {
      layerControls.layerControler.remove();
      layerControls.layerControler = null;
    }
  },

  addLayersControler: function (map) {
    if (layerControls.layerControler) {
      layerControls.layerControler.remove();
    }

    layerControls.layerControler = L.control.layers(baseMaps).addTo(map);
  },
};

export { layerControls };
