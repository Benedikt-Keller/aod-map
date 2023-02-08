import React from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import "./index.css"
import { useState, useEffect } from "react";
import _ from 'lodash';
import { getImageSize } from 'react-image-size';

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


function findFalseImages(buildings){
  buildings.features.map(buildLinkTest => {
    getImageSize(buildLinkTest.Image_URL)
    .then(({ width, height }) => {
      if (Number(width) < 64){
          console.log("Wrong Image:", buildLinkTest.Image_URL)
    }}).catch((errorMessage) => {
      console.log(errorMessage, buildLinkTest.Text1)
    });
  })
}

export default function App() { 
  const [activeMarkerTitle, setActiveMarkerTitle] = React.useState(null);
  const [activeMarkerImages, setActiveMarkerImages] = React.useState([]);
  const [countError, setCountError] = React.useState(0);
  const buildings = require("./data/aod.json");
  const uniqueBuildings = getUnique(buildings.features,"Text1");

  useEffect( 
    findFalseImages(buildings), // <- function that will run on every dependency update
    [] // <-- empty dependency array
  ) 
 
  return (
    <div style={{ 
      overflow: "hidden"
    }}> 
    <div className="sidebar" style={{
        fontSize: "20px",
        fontWeight: "bold",
        textOverflow: "ellipsis",
        wordWrap: "break-word",
        }}> 
        <h1> {activeMarkerTitle} </h1>
       
        {activeMarkerImages.map(d => (
        <img src={d} style={{
          resizeMode: 'contain',
          height: '500px'
        }}/>
        ))} 
    </div>

    <MapContainer center={[50.142255, 8.671575]} 
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
        eventHandlers={{
          click: (e) => {
            console.log('marker clicked')
            setActiveMarkerTitle(building.Text1);
            const links = buildings.features.map(build => {
            if (build.Text1 === building.Text1){
                return build.Image_URL
            }})
            setActiveMarkerImages(links)
        
          },
        }}
        >
        </Marker>
      ))}

    </MapContainer>
    </div>
  );
}
