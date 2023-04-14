import React from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import { Icon, LatLng, marker } from 'leaflet'
import "./index.css"
import { useState, useEffect, useMemo } from "react";
import _, { split } from 'lodash';
import { getImageSize } from 'react-image-size';
import Sidebar from "./components/sidebar";
import { useWindowSize } from "usehooks-ts";

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

function MapController({ activeLatLong, centerOnMarker, setCenterOnMarker, markerClicked, zoomOut, setZoomOut }) {
  const map = useMap()
  const {width, height } = useWindowSize()
  const memoizedWindowSize = useMemo(() => ({ width, height }), [width, height]);
  const currCenter = map.getCenter()
  const activeLtLng = new LatLng(Number(activeLatLong.lat), Number(activeLatLong.long))
  var x = map.latLngToContainerPoint(activeLtLng).x - window.innerWidth / 5.5;
  var y = map.latLngToContainerPoint(activeLtLng).y;
  var xb = map.latLngToContainerPoint(currCenter).x + window.innerWidth / 5.5;
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
                <img className="header-icon" src="/orreddot.svg"></img>
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
         



          <MapContainer center={[50.142255, 8.671575]}
            zoom={2.7}
            maxBounds={[[-300, -260], [90, 260]]}
            maxBoundsViscosity={1}
            detectRetina={true}
            minZoom={1.5}
            maxZoom={15}
            zoomControl={false}

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
              url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}"
              attribution='&copy; <Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              ext="png"
              minZoom={1}
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
                    setCenterOnMarker(false)
                    setActiveMarkerInfo(uniqueLinks)
                    setSidebarWidth("sidebar")
                    setRecentMarkerLat(activeMarkerLat)
                    setRecentMarkerLat(activeMarkerLng)
                    setActiveMarkerLat(Number(building.latitude))
                    setActiveMarkerLng(Number(building.longitude))
                    
                  },
                }}


              >
              </Marker>

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
