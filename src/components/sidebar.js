import React from "react";
import { useEffect } from "react";
import { VscChromeClose } from "react-icons/vsc";
import "./../index.css"
import { RiSearch2Line } from "react-icons/ri";
import {HiOutlineArrowUpRight} from "react-icons/hi2";

function setWidth(setCurrentWidth, width) {
  setCurrentWidth(width)
}

function postDisplay() {
  
}


function Sidebar({ activeMarkerTitle, activeMarkerImages, sidebarWidth, setSidebarWidth, activeLatLong, setActiveMarkerLat, setActiveMarkerLng, setRecentMarkerLat, setRecentMarkerLng, setCenterOnMarker, setMarkerClicked }) {
  const sidebarDiv = document.getElementsByClassName("sidebar")
  return (

    <div id="sidebar" className={sidebarWidth}>
      <div className="sidebar-header">
        <div className="sidebar-header-title">
          <div className="sidebar-heading">
            {activeMarkerTitle}
            <VscChromeClose className="close-button" onClick={() => {
              setSidebarWidth("sidebar-collapsed")
              document.documentElement.style.setProperty("--leaflet-offset", "0%")
              setRecentMarkerLat(activeLatLong.lat)
              setRecentMarkerLng(activeLatLong.long)
              setActiveMarkerLat(1000)
              setActiveMarkerLng(1000)
              setCenterOnMarker(true)
              setMarkerClicked(false)
              const sidebarDiv = document.getElementsByClassName('sidebar')[0]
              sidebarDiv.scrollTo({
                top: 0,
                behavior: "smooth"
              })
            }} />
          </div>
        </div>
      </div>

      {activeMarkerImages.map(element => (
        <>
          <div className="content-container">
            <img src={element.link} className="img-style" alt=""></img>
            <div className="post-info">
              <div className="post-date">
                <span className="basic-text"> <b> date: </b>{element.date} </span>
              </div>
              <div className="post-link"
              onClick={
                () => {
                  window.open(element.link, '_blank', 'noreferrer')
                }
               }
              >
                <span className="basic-text"> View on Tumblr </span>
                <HiOutlineArrowUpRight className="post-button"
                />
              </div>
            </div>
           
              <span className="post-text">
                {element.desc} 
              </span>
          </div>

        </>
      ))
      }
    </div>

  )

}

export default Sidebar;