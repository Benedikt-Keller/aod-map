import React from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import { Icon, LatLng, marker } from 'leaflet'
import "./index.css"
import { useState, useEffect, useRef } from "react";
import _, { split } from 'lodash';
import { getImageSize } from 'react-image-size';
import Sidebar from "./components/sidebar";
import { BiExpandAlt } from "react-icons/bi";
import { MdZoomOutMap } from "react-icons/md";

export const icon = new Icon({
  iconUrl: "/blackdot.svg",
  iconSize: [13, 13]
});

export const selectedIcon = new Icon({
  iconUrl: "/orreddot.svg",
  iconSize: [13, 13]
});

export const recentlySelectedIcon = new Icon({
  iconUrl: "/graydot.svg",
  iconSize: [13, 13]
});

function MapController({ activeLatLong, centerOnMarker, setCenterOnMarker, markerClicked }) {
  const map = useMap()
  const activeLtLng = new LatLng(Number(activeLatLong.lat), Number(activeLatLong.long))
  var x = map.latLngToContainerPoint(activeLtLng).x - window.innerWidth / 5.5;
  var y = map.latLngToContainerPoint(activeLtLng).y;
  var point = map.containerPointToLatLng([x, y])
    if (window.innerWidth < 1000 || centerOnMarker) {
      map.setMaxBounds([[-300, -260], [90, 260]])
      map.panTo([Number(activeLatLong.lat), Number(activeLatLong.long)], {
        animate: true,
        duration: 0.6,
        easeLinearity: 0.25
      })
    } else {
      if(markerClicked){
        map.setMaxBounds([[-300, -400], [90, 300]])
      }
      
      map.panTo(point, { 
        animate: true, 
        duration: 0.6,
        easeLinearity: 0.25
      })
    }
  
  

  //console.log('map center:', map.getCenter())
  return null
}


function getUnique(arr, comp) {
  // store the comparison  values in array
  const unique = arr.map(e => e[comp])
    // store the indexes of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the false indexes & return unique objects
    .filter((e) => arr[e]).map(e => arr[e]);
  return unique;
}


function findFalseImages(buildings) {
  buildings.features.map(buildLinkTest => {
    getImageSize(buildLinkTest.Image_URL)
      .then(({ width, height }) => {
        if (Number(width) < 64) {
          console.log("Wrong Image:", buildLinkTest.Image_URL)
        }
      }).catch((errorMessage) => {
        console.log(errorMessage, buildLinkTest.Text1)
      });
  })
}


export default function App() {
  const calcHeight = (window.innerHeight - 100).toString()
  document.documentElement.style.setProperty('--leaflet-height', calcHeight)
  const [activeMarkerTitle, setActiveMarkerTitle] = React.useState("The Barbican, London, England");
  const [activeMarkerLat, setActiveMarkerLat] = React.useState(Number("1000"));
  const [activeMarkerLng, setActiveMarkerLng] = React.useState(Number("1000"));
  const [recentMarkerLat, setRecentMarkerLat] = React.useState(Number("1000"));
  const [recentMarkerLng, setRecentMarkerLng] = React.useState(Number("1000"));
  const [centerOnMarker, setCenterOnMarker] = React.useState(false);
  const [markerClicked, setMarkerClicked] = React.useState(false)

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
      lat: "50.142255",
      long: "8.671575"
    }
  );

  const [sidebarWidth, setSidebarWidth] = React.useState("sidebar-collapsed")

  const buildings = require("./data/aod.json");
  const uniqueBuildings = getUnique(buildings.features, "Text1");

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

          <MdZoomOutMap className="expand-button" onClick={() => {

          }} />

          <div className="header">
            <span className="header-text-fullsize">ARCHITECTURE OF DOOM</span>
            <span className="header-text-small">ARCHITECTURE OF <br></br>DOOM</span>
            <img className="header-icon" src="/orreddot.svg"></img>
          </div>


          <MapContainer center={[50.142255, 8.671575]}
            zoom={2.7}
            maxBounds={[[-300, -260], [90, 260]]}
            maxBoundsViscosity={1}
            detectRetina={true}
            minZoom={3}
            maxZoom={15}
            zoomControl={false}

          >
            <MapController
              activeLatLong={activeLatLong}
              centerOnMarker={centerOnMarker}
              setCenterOnMarker={setCenterOnMarker}
              markerClicked={markerClicked}
            ></MapController>

            <TileLayer
              url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}"
              attribution='&copy; <Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              ext="png"
              minZoom={2}
              maxZoom={30}
              detectRetina={true}
              tileSize={256}
              zoomOffset={0}
            />
            <Marker
              position={[activeMarkerLat, activeMarkerLng]}
              icon={selectedIcon}
              key={activeLatLong}
              zIndexOffset={1000}
            ></Marker>

            <Marker
              position={[recentMarkerLat, recentMarkerLng]}
              icon={recentlySelectedIcon}
              key={recentMarkerLng}
              zIndexOffset={500}
              eventHandlers={{
                click: (e) => {
                  setMarkerClicked(true)
                  setCenterOnMarker(false)
                  setSidebarWidth("sidebar")
                  setActiveMarkerLat(recentMarkerLat)
                  setActiveMarkerLng(recentMarkerLng)
                  const sidebarDiv = document.getElementsByClassName('sidebar')[0]
                  try {
                    sidebarDiv.scrollTo({
                      top: 0
                    })
                  } catch (error) {

                  }

                }
              }}
            ></Marker>



            {uniqueBuildings.map(building => (
              <Marker
                position={[Number(building.latitude), Number(building.longitude)]}
                icon={icon}
                key={building.Text1}
                eventHandlers={{
                  click: (e) => {
                    // mark current marker
                    //MapContainer.setView([Number(building.latitude),Number(building.longitude)], 9)
                    console.log('marker clicked')
                    setActiveMarkerTitle(building.Text1);
                    setActiveLatlong({
                      lat: building.latitude,
                      long: building.longitude
                    })
                    const links2 = [];
                    const links = buildings.features.map(build => {
                      if (build.Text1 === building.Text1 && build.Image_URL != "") {

                        const splitTags = build.Text.split("Tags:");
                        const splitNotes = build.Text.substring(14, 30).split("notes");
                        const splitDesc = build.Text.split("notes")[1].split("Tags:")[0].split("View this on the map");
                        const tags = splitTags[1];
                        const date = build.Text.substring(0, 14);
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
                      }
                    })
                    setMarkerClicked(true)
                    setCenterOnMarker(false)
                    setActiveMarkerImages(links2)
                    setSidebarWidth("sidebar")
                    setRecentMarkerLat(activeMarkerLat)
                    setRecentMarkerLat(activeMarkerLng)
                    setActiveMarkerLat(Number(building.latitude))
                    setActiveMarkerLng(Number(building.longitude))
                    const sidebarDiv = document.getElementsByClassName('sidebar')[0]
                    try {
                      sidebarDiv.scrollTo({
                        top: 0
                      })
                    } catch (error) {

                    }
                  },
                }}


              >
              </Marker>

            ))}

          </MapContainer>



          <Sidebar
            activeMarkerTitle={activeMarkerTitle}
            activeMarkerImages={activeMarkerImages}
            sidebarWidth={sidebarWidth}
            setSidebarWidth={setSidebarWidth}
            activeLatLong={activeLatLong}
            setActiveMarkerLat={setActiveMarkerLat}
            setActiveMarkerLng={setActiveMarkerLng}
            setRecentMarkerLat={setRecentMarkerLat}
            setRecentMarkerLng={setRecentMarkerLng}
            setCenterOnMarker={setCenterOnMarker}
            setMarkerClicked={setMarkerClicked}
          />



        </div>) : (
        <div className="loading-screen">
          <span className="loading-text"> ARCHITECTURE OF DOOM</span>
          <img className="loading-icon" src="/orreddot.svg" ></img>
        </div>
      )}
    </>
  );
}
