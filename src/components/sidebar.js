import React from "react";
import { useEffect } from "react";
import { VscChromeClose } from "react-icons/vsc";

function setWidth(setCurrentWidth, width){
  setCurrentWidth(width)
}


function Sidebar({activeMarkerTitle, activeMarkerImages, sidebarWidth, setSidebarWidth, activeLatLong, setActiveMarkerLat, setActiveMarkerLng}){
    return(
    <div className={sidebarWidth}>
    <div className="sidebar-header"> 
      <div className="sidebar-header-title">
        <h1 className="big-heading"> {activeMarkerTitle} </h1>
        <VscChromeClose className="close-button" onClick={() => {
          setSidebarWidth("sidebar-collapsed")
          document.documentElement.style.setProperty("--leaflet-offset", "0%")
          document.documentElement.style.setProperty("--leaflet-width", "100%") 
          setActiveMarkerLat(1000)
          setActiveMarkerLng(1000)

        }}/>
        
      </div>

      <p className="basic-heading">  <b>latitude: </b>{activeLatLong.lat} <br></br> 
            <b>longitude: </b>{activeLatLong.long}
      </p>
    </div>
    
    {activeMarkerImages.map(element => (
      <>
      <div className="content-container">
        <img src={element.link} className="img-style" alt=""></img>
        <p className="basic-text"> 
        <b> date: </b>{element.date} <br/>
        <b> tags: </b>{element.tags} <br/>
        <b> notes: </b>{element.notes} <br/>
        <b> desc: </b>{element.desc} <br/>
        </p>
      </div>
      </>
    ))
    }
    </div>

    )
    
}

export default Sidebar;