import React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon, latLng, latLngBounds } from "leaflet";
import * as parkData from "./data/skateboard-parks.json";
import * as markerData from "./data/aod.json";
import * as uniqueBuildingsJSON from "./data/aod-unique.json";
import "./App.css";
import _ from 'lodash';
import { flushSync } from "react-dom";

// setting up bounds

export const icon = new Icon({
  iconUrl: "/reddot.svg",
  iconSize: [15, 15]
});

function getUnique(arr, comp) {
  // store the comparison  values in array
    const unique =  arr.map(e => e[comp])
  // store the indexes of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
  // eliminate the false indexes & return unique objects
    .filter((e) => arr[e]).map(e => arr[e]);
return unique;
}

export default function App() { 
  const [activePark, setActivePark] = React.useState(null);
  const buildings = require("./data/aod.json");
  const uniqueBuildings = getUnique(buildings.features,"Text1");
  console.log(uniqueBuildings);

  return (
    <Map center={[50.142255, 8.671575]} zoom={2.7} maxBounds={[[-90, -260],[90, 260]]} maxBoundsViscosity={1} detectRetina={true} >
      <TileLayer
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}"
        attribution='&copy; <Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        ext="png"
        minZoom={3}
        maxZoom={15}
        detectRetina={true}
      />

      {parkData.features.map(park => (
        <Marker
          key={park.properties.PARK_ID}
          position={[
            park.geometry.coordinates[1],
            park.geometry.coordinates[0]
          ]}
          onClick={() => {
            setActivePark(park);
          }}
          icon={icon}
        />
      ))}

      {uniqueBuildings.map(building => (
        <Marker
        key={building.Text1}
        position={[
          Number(building.latitude),
          Number(building.longitude)
        ]}
        icon={icon}
      />
      ))}     
    </Map>
  );
}
