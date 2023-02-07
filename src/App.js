import React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { FiHome, FiChevronRight, FiSearch, FiSettings } from "react-icons/fi";
import { divIcon, Icon, latLng, latLngBounds } from "leaflet";
import _ from 'lodash';
import { flushSync } from "react-dom";
import { useState, useEffect } from "react";

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

const loadImage = (setImageDimensions, imageUrl) => {
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    setImageDimensions({
      height: img.height,
      width: img.width
    });
  };
  img.onerror = (err) => {
    console.log("img error");
    console.error(err);
  };
};



export default function App() { 
  const [activeMarkerTitle, setActiveMarkerTitle] = React.useState(null);
  const [activeMarkerImages, setActiveMarkerImages] = React.useState([]);
  const [imageDimensions, setImageDimensions] = useState({});
  const buildings = require("./data/aod-testcopy.json");
  const uniqueBuildings = getUnique(buildings.features,"Text1");
  const imageUrl = "";
  let once = 1;
  
   // loadImage(setImageDimensions, imageUrl);
   // console.log(imageDimensions.width, imageDimensions.height);

  
  
  return (
    <div style={{
      overflow: "hidden"
    }}> 
    <div className="sidebar" style={{
        fontSize: "20px",
        fontWeight: "bold",
        textOverflow: "ellipsis",
        wordWrap: "break-word",
        overflow: "scroll"
        }}> 
        <h1> {activeMarkerTitle} </h1>
       
        {activeMarkerImages.map(d => (
        <img src={d} style={{
          resizeMode: 'contain',
          height: '500px'
        }}/>
        ))} 
    </div>

    <div>
      {buildings.features.map(buildLinkTest => {
        
      })}
    </div>

    <Map center={[50.142255, 8.671575]} 
    zoom={2.7} 
    maxBounds={[[-90, -260],[90, 260]]} 
    maxBoundsViscosity={1} 
    detectRetina={true} 
   >
      <TileLayer
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}"
        attribution='&copy; <Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        ext="png"
        minZoom={3}
        maxZoom={15}
        detectRetina={true}
        tileSize={256}
        zoomOffset= {0}
      />

      {uniqueBuildings.map(building => (
        <Marker 
        position = {[Number(building.latitude),Number(building.longitude)]}
        icon = {icon}
        key = {building.Text1}
        onClick={() => {
          setActiveMarkerTitle(building.Text1);
          {const links = buildings.features.map(build => {
            if (build.Text1 === building.Text1){
              console.log(building.Text1, build.Image_URL)
              return build.Image_URL
            }})
          setActiveMarkerImages(links)
        }
        }}
        >
        </Marker>
      ))}

    </Map>
    </div>
  );
}