// base map
var map = L.map('map', {maxBounds: [[-90, -260],[90, 260]],
    maxBoundsViscosity: 1}).setView([50.142255, 8.671575], 2.7);
var corner1 = L.latLng([81.4, 176.08]);
var corner2 = L.latLng([-74.2, -163.3]);
var mapBounds = L.latLngBounds(corner2, corner1);

var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    detectRetina: true,
    minZoom: 3,
    maxZoom: 15,
    ext: "png"
});
map.addLayer(Stamen_Toner);
map.zoomControl.remove();



// marker icon design
var costumMarker = L.icon({
    iconUrl: 'assets/costum marker design1.png',
    iconSize: [25, 25]
});

// sidebars
var sidebar = L.control.sidebar('sidebar', {
    closeButton: true,
    position: 'left'
});
map.addControl(sidebar);

var sidebar2 = L.control.sidebar('sidebar2', {
    closeButton: true,
    position: 'left'
});
map.addControl(sidebar2);

var sidebar3 = L.control.sidebar('sidebar3', {
    closeButton: true,
    position: 'left'
});
map.addControl(sidebar3);

// markers
var marker_1_arromanches_les_bains = L.marker([49.339519, -0.620132], {icon: costumMarker});
marker_1_arromanches_les_bains.addTo(map);
marker_1_arromanches_les_bains.on('click', function(){sidebar.show();}); 




