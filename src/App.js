import React from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup, CircleMarker } from 'react-leaflet'
import { Icon, LatLng, marker } from 'leaflet'
import "./index.css"
import { useState, useEffect, useRef } from "react";
import _, { split } from 'lodash';
import { getImageSize } from 'react-image-size';
import Sidebar from "./components/sidebar";
import { useWindowSize } from "usehooks-ts";
import glify from "leaflet.glify";
import { GlifyPoints } from 'react-leaflet-glify';

export const icon = new Icon({
  iconUrl: "/blackdot.svg",
  iconSize: [16, 16]
});

export const selectedIcon = new Icon({
  iconUrl: "/orreddot.svg",
  iconSize: [18, 18]
});

export const recentlySelectedIcon = new Icon({
  iconUrl: "/graydot.svg",
  iconSize: [18, 18]
});

function MapController({ activeLatLong, centerOnMarker, setCenterOnMarker, markerClicked, zoomOut, setZoomOut }) {
  const map = useMap()
  const windowSizeRef = useRef({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      windowSizeRef.current = { width: window.innerWidth, height: window.innerHeight };
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { width, height } = windowSizeRef.current;
  const currCenter = map.getCenter()
  const activeLtLng = new LatLng(Number(activeLatLong.lat), Number(activeLatLong.long))
  var x = map.latLngToContainerPoint(activeLtLng).x - window.innerWidth / 4;
  var y = map.latLngToContainerPoint(activeLtLng).y;
  var xb = map.latLngToContainerPoint(currCenter).x + window.innerWidth / 4;
  var yb = map.latLngToContainerPoint(currCenter).y
  var point = map.containerPointToLatLng([x, y])
  var pointb = map.containerPointToLatLng([xb,yb])
  if(width < 1000){
    map.panTo(activeLtLng, {
      animate: true,
      duration: 0.6,
      easeLinearity: 0.25
    })
  } else {
    if (window.innerWidth < 1000 || centerOnMarker) {
      map.setMaxBounds([[-300, -260], [90, 260]])
      map.panTo(pointb, {
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
  }
    
  
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
  const [lastPostDate, setLastPostDate] = React.useState("")
  const [mapPosition, moveMapPosition] = React.useState("leaflet-container");
  const [zoomOut, setZoomOut] = React.useState(false);

  const [activerMarkerInfo, setActiveMarkerInfo] = React.useState(
    [
      {
        link: "https://64.media.tumblr.com/tumblr_lyaji1h7d71r3olkxo1_500.jpg",
        desc: "\n2012/04/04\n\n    112 notes\n\n\n        Barbican Estate, London, Chamberlin, Powell and Bon, 1965-76. View this on the mapdontrblgme:Apartments (via Thomas Bayes)(via infiniteinterior) \n\n          \n            Tags:\n              \n                 housing\n              \n                 complex\n              \n                 London\n              \n                 1960's\n              \n                 1970's\n              \n          \n\n",
        tags: "",
        date: "",
        notes: "",
        pageurl: ""
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

  const buildings = require("./data/aodscrape.json");
  const uniqueBuildings = getUnique(buildings.features, "Text1");
  const points = [
    { lat: 51.5, lng: -0.1 },
    { lat: 51.51, lng: -0.1 },
    { lat: 51.49, lng: -0.05 },
    { lat: 51.49, lng: -0.05 },
    { lat: 51.5, lng: -0.1 },
  ];


  const [isLoading, setIsLoading] = useState(false);
  const [sidebarLoading, setSidebarLoading] = useState(false);

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

<div className="header">
          <span className="header-text-small">ARCHITECTURE OF <br></br>DOOM</span>
          <span className="header-text-small-small">ARCHITECTURE OF <br></br>DOOM</span>
            <div className="header-text-container">
                <div className="header-links">
                  <span className="header-link" onClick={() => {
                      window.open("https://architectureofdoom.tumblr.com", "_self")
                  }}>  
                  <u> tumblr </u>  </span>
                  <span className="header-link" onClick={() => {
                      window.open("https://architectureofdoom.tumblr.com/archive", "_self")
                  }}> 
                  <u> archive  </u></span>
                </div>
                <div className="header-icon"></div>
            </div>
          </div>
          <div className="header-links-small">
                  <span className="header-link" onClick={() => {
                      window.open("https://architectureofdoom.tumblr.com", "_self")
                  }}>  
                  <u> tumblr </u>  </span>
                  <span className="header-link" onClick={() => {
                      window.open("https://architectureofdoom.tumblr.com/archive", "_self")
                  }}> 
                  <u> archive  </u></span>
          </div>

          <div className={`line ${markerClicked ? 'active' : ''}`}></div>
        
          <MapContainer className={mapPosition} center={[50.142255, 8.671575]}
            zoom={2.7}
            maxBounds={[[-300, -260], [90, 260]]}
            maxBoundsViscosity={1}
            detectRetina={false}
            minZoom={1.5}
            maxZoom={15}
            zoomControl={false}
            preferCanvas={true}
          >
            <MapController
              activeLatLong={activeLatLong}
              centerOnMarker={centerOnMarker}
              setCenterOnMarker={setCenterOnMarker}
              markerClicked={markerClicked}
              zoomOut={zoomOut}
              setZoomOut={setZoomOut}
            ></MapController>

            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png
              "
              attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>
              &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>
              &copy; <a href="https://www.openstreetmap.org/about/" target="_blank">OpenStreetMap contributors</a>'
              ext="png"
              minZoom={1}
              maxZoom={30}
              detectRetina={true}
              tileSize={256}
              zoomOffset={0}
              preferCanvas={true}
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
                }
              }}
            ></Marker>
             
            {uniqueBuildings.map(building => (
              <CircleMarker
                center={[Number(building.latitude), Number(building.longitude)]}
                color={'#171717'}
                radius={8}
                opacity={1.0}
                fillOpacity={1.0}
                stroke={false}
                key={building.Text1}
                eventHandlers={{
                  click: (e) => {
                    // mark current marker
                    console.log('marker clicked')

                    moveMapPosition("leaflet-container-moved")

                    setActiveMarkerTitle(building.Text1);
                    setActiveLatlong({
                      lat: building.latitude,
                      long: building.longitude
                    })
                    const links2 = [];
                    const links = buildings.features.map(build => {
                      if (build.Text1 === building.Text1 && build.Image_URL != "") {
                        var tags; 
                        var date;
                        var notes
                        var desc;
                        var pageurl = build.Page_URL === "" ? build.Page_URL1 : build.Page_URL;
                        if (build.Text === ""){
                          tags = "";
                          date = lastPostDate;
                          notes = "";
                          desc = "";

                        } else {
                          const splitTags = build.Text.split("Tags:");
                          const splitNotes = build.Text.substring(14, 30).split("notes");
                          const splitDesc = build.Text.split("notes")[1].split("Tags:")[0].split("View this on the map");
                          tags = splitTags[1];
                          date = build.Text.substring(0, 14);
                          notes = splitNotes[0];
                          desc = splitDesc[0];
                          setLastPostDate(date);
                        }
                          
                         
                        
                        if(build.Text === ""){
                          links2.push({
                              link: build.Multiple_Images_URL,
                              desc: "",
                              tags: "",
                              date: "",
                              notes: "",
                              pageurl: pageurl
                          })
                        } else {
                          if(build.Multiple_Images_URL === ""){
                            links2.push({
                              link: build.Single_Image_URL,
                              tags: tags,
                              date: date,
                              notes: notes,
                              desc: "desc:" + desc,
                              pageurl: pageurl
                            })
                          } else {
                            links2.push({
                              link: build.Multiple_Images_URL,
                              tags: tags,
                              date: date,
                              notes: notes,
                              desc: "desc: " + desc,
                              pageurl: pageurl
                          })
                          }
                        }
                        return null
                      }
                    })
                    const uniqueLinks = [...new Map(links2.map((m) => [m.link, m])).values()];
                    setMarkerClicked(true)
                    setSidebarLoading(false)
                    setCenterOnMarker(false)
                    setActiveMarkerInfo(uniqueLinks)
                    setSidebarWidth("sidebar")
                    setRecentMarkerLat(activeMarkerLat)
                    setRecentMarkerLat(activeMarkerLng)
                    setActiveMarkerLat(Number(building.latitude))
                    setActiveMarkerLng(Number(building.longitude))
                    document.documentElement.style.setProperty('--show-content', "hidden")
                    document.documentElement.style.setProperty('--show-loading', "flex")
                    const sidebarDiv = document.getElementsByClassName('sidebar')[0];
                    sidebarDiv.scrollTo({
                    top: 0,
                    });
                  },
                }}


              >
              </CircleMarker>

            ))}
          </MapContainer>



          <Sidebar
            activeMarkerTitle={activeMarkerTitle}
            activeMarkerImages={activerMarkerInfo}
            sidebarWidth={sidebarWidth}
            setSidebarWidth={setSidebarWidth}
            activeLatLong={activeLatLong}
            setActiveMarkerLat={setActiveMarkerLat}
            setActiveMarkerLng={setActiveMarkerLng}
            setRecentMarkerLat={setRecentMarkerLat}
            setRecentMarkerLng={setRecentMarkerLng}
            setCenterOnMarker={setCenterOnMarker}
            setMarkerClicked={setMarkerClicked}
            sidebarLoading={sidebarLoading}
            setSidebarLoading={setSidebarLoading}
          />



        </div>) : (
        <div className="loading-screen">
          <span className="loading-text"> ARCHITECTURE OF DOOM</span>
          <div className="loading-icon" ></div>
        </div>
      )}
    </>
  );
}
