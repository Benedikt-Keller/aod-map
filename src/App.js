import React from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import "./index.css"
import { useState, useEffect } from "react";
import _, { split } from 'lodash';
import { getImageSize } from 'react-image-size';
import Sidebar from "./components/sidebar";
import VectorTileLayer from "react-leaflet-vector-layer";

export const icon = new Icon({
  iconUrl: "/orreddot.svg",
  iconSize: [15, 15]
});

export const selectedIcon = new Icon({
  iconUrl: "/selectdot.svg",
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
  const [activeMarkerTitle, setActiveMarkerTitle] = React.useState("The Barbican, London, England");
  const [activeMarkerImages, setActiveMarkerImages] = React.useState(
    [
      {
        link: "https://64.media.tumblr.com/tumblr_lyaji1h7d71r3olkxo1_500.jpg",
        desc: "\n2012/04/04\n\n    112 notes\n\n\n        Barbican Estate, London, Chamberlin, Powell and Bon, 1965-76. View this on the mapdontrblgme:Apartments (via Thomas Bayes)(via infiniteinterior) \n\n          \n            Tags:\n              \n                 housing\n              \n                 complex\n              \n                 London\n              \n                 1960's\n              \n                 1970's\n              \n          \n\n",
        tags: "",
        date: "",
        notes: "",
        desc: ""
      }
    ]
  );
  const [activeLatLong, setActiveLatlong] = React.useState(
      {
        lat: "51.51898500000003",
        long: "-0.09371599999999924"
      }
  );

  const [sidebarWidth, setSidebarWidth] = React.useState("sidebar-collapsed")
  const pageTitle = `${"AOD Map"}`;
  document.title = pageTitle;
  const buildings = require("./data/aod.json");
  const uniqueBuildings = getUnique(buildings.features,"Text1");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 2000);
  }, []);
 
  return (
    <>
    {isLoading ? (
    <div style={{ 
      overflow: "hidden"
    }}> 
    <MapContainer center={[50.142255, 8.671575]} 
    zoom={2.7} 
    maxBounds={[[-90, -260],[90, 260]]} 
    maxBoundsViscosity={1} 
    detectRetina={true} 
    minZoom={3}
    maxZoom={15}
   >
      <TileLayer
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}"
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
            // mark current marker
             <Marker 
            position = {[Number(building.latitude) + 5 ,Number(building.longitude) + 5]}
            key = {building.Text} 
            icon = {selectedIcon}/> 
            console.log('marker clicked')
            setActiveMarkerTitle(building.Text1);
            setActiveLatlong({
              lat: building.latitude,
              long: building.longitude
            })
            const links2 = [];
            const links = buildings.features.map(build => {
            if (build.Text1 === building.Text1 && build.Image_URL != ""){
              
                const splitTags = build.Text.split("Tags:");
                const splitNotes = build.Text.substring(14,30).split("notes");
                const splitDesc = build.Text.split("notes")[1].split("Tags:")[0].split("View this on the map");
                const tags = splitTags[1];
                const date = build.Text.substring(0,14);
                const notes = splitNotes[0];
                const desc = splitDesc[0];
                

                links2.push({
                  link: build.Image_URL,
                  desc: build.Text,
                  tags: tags,
                  date: date,
                  notes: notes,
                  desc: desc
                })
                return null
            }})
            setActiveMarkerImages(links2) 
            setSidebarWidth("sidebar")
            document.documentElement.style.setProperty("--leaflet-offset", "40%")
            console.log(sidebarWidth)
            //console.log(links2)     
          },
        }}
        

        >
          <Popup> <img className="select-icon" src="/selectdot.svg" ></img> </Popup>
        </Marker>
      ))}

    </MapContainer>

    <Sidebar 
    activeMarkerTitle={activeMarkerTitle} 
    activeMarkerImages={activeMarkerImages} 
    sidebarWidth={sidebarWidth} 
    setSidebarWidth={setSidebarWidth} 
    activeLatLong={activeLatLong}
    />

    </div>) : (
      <div className="loading-screen">
        <h1 className="loading-text">Architecture of Doom - The Map</h1>
        <img className="loading-icon" src="/orreddot.svg" ></img>
      </div>
    )}
    </>
  );
}
