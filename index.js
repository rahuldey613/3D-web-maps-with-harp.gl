const canvas = document.getElementById('map');
const map = new harp.MapView({
   canvas,
   theme: "https://unpkg.com/@here/harp-map-theme@latest/resources/berlin_tilezen_night_reduced.json",
   //For tile cache optimization:
   maxVisibleDataSourceTiles: 40, 
   tileCacheSize: 100
});

fetch('wireless-hotspots.geojson')
.then(data => data.json())
.then(data => {
   const geoJsonDataProvider = new harp.GeoJsonDataProvider("wireless-hotspots", data);
   const geoJsonDataSource = new harp.OmvDataSource({
      dataProvider: geoJsonDataProvider,
      name: "wireless-hotspots"
   });

   map.addDataSource(geoJsonDataSource).then(() => {
    const styles = [{
       when: "$geometryType == 'point'",
       technique: "circles",
       renderOrder: 10000,
       attr: {
          color: "#7ED321",
          size: 15
       }
    }]
    geoJsonDataSource.setStyleSet(styles);
    map.update();
 });
})

map.setCameraGeolocationAndZoom(
   new harp.GeoCoordinates(1.278676, 103.850216),
   16
);

const mapControls = new harp.MapControls(map);
const ui = new harp.MapControlsUI(mapControls);
canvas.parentElement.appendChild(ui.domElement);
//Set the max pitch angle
mapControls.maxPitchAngle = 90;
mapControls.setRotation(6.3, 50);

map.resize(window.innerWidth, window.innerHeight);
window.onresize = () => map.resize(window.innerWidth, window.innerHeight);

const omvDataSource = new harp.OmvDataSource({
   baseUrl: "https://xyz.api.here.com/tiles/herebase.02",
   apiFormat: harp.APIFormat.XYZOMV,
   styleSetName: "harp.APIFormat.XYZSpace",
   authenticationCode: 'ACbs-cqcFI4FlPRLK_VF1co',
});
map.addDataSource(globalRailroads).then(() => {
    const styles = [
       {
          "when": "$geometryType ^= 'line' && properties.status == 'Open'",
          "renderOrder": 1000,
          "technique": "solid-line",
          "attr": {
             "color": "#50E3C2",
             "transparent": true,
             "opacity": 1,
             "metricUnit": "Pixel",
             "lineWidth": 1
          }
       },
       {
          "when": "$geometryType ^= 'line' && properties.status == 'Open' || properties.status == 'Unknown'",
          "renderOrder": 1000,
          "technique": "solid-line",
          "attr": {
             "color": "#D63060",
             "transparent": true,
             "opacity": 1,
             "metricUnit": "Pixel",
             "lineWidth": 1
          }
       }
    ]
    globalRailroads.setStyleSet(styles);
    map.update();
 });