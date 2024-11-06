import Map from 'ol/Map.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import OGCVectorTile from 'ol/source/OGCVectorTile.js';
import VectorTile from 'ol/source/VectorTile.js';
import View from 'ol/View.js';
import MVT from 'ol/format/MVT.js';
import TileGrid from 'ol/tilegrid/TileGrid';
import Projection from 'ol/proj/Projection';
import {
    getTopLeft
}
from 'ol/extent.js';
import {
    applyStyle
}
from 'ol-mapbox-style';

export const PROJECTION_EXTENT = [-285401.92, 22598.08, 595401.92, 903401.92];
export const PROJECTION = new Projection({
    code: 'EPSG:28992',
    extent: PROJECTION_EXTENT,
    units: 'm'
});

const styleUrl = 'https://api.pdok.nl/lv/bgt/ogc/v1/styles/bgt_standaardvisualisatie__netherlandsrdnewquad?f=mapbox'; // Replace with your style JSON URL
const baseUrl = 'https://api.pdok.nl/lv/bgt/ogc/v1/tiles/NetherlandsRDNewQuad'

const tileGrid = new TileGrid({
        extent: PROJECTION_EXTENT,
        resolutions: [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21, 0.105, 0.0525, 0.02625],
        tileSize: [256, 256],
        origin: getTopLeft(PROJECTION_EXTENT)
    });

const ogcVectorTileSource = new OGCVectorTile({
    format: new MVT(),
    projection: PROJECTION,
    tileGrid: tileGrid,
    url: baseUrl,
    cacheSize: 0

});

const vectorTileSource = new VectorTile({
    format: new MVT(),
    projection: PROJECTION,
    tileGrid: tileGrid,
    url: `${baseUrl}/{z}/{y}/{x}`,
    cacheSize: 0

});

// Create the VectorTile layer without the manual style function
const vectorTileLayer = new VectorTileLayer({
    source: vectorTileSource,
    useInterimTilesOnError: false
});

const ogcVectorTileLayer = new VectorTileLayer({
    source: ogcVectorTileSource,
    useInterimTilesOnError: false
});


applyStyle(vectorTileLayer, styleUrl).then(() => {
    console.log('Style applied successfully', styleUrl);
}).catch(error => {
    console.error('Error applying style:', error);
});

const map = new Map({
    layers: [vectorTileLayer, ogcVectorTileLayer],

    target: 'map',

    view: new View({
        projection: PROJECTION,
        center: [119405, 476720],
        zoom: 12,
        enableRotation: false
    }),
});
