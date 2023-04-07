import React from "react";
import { useEffect } from "react";
import { VscChromeClose } from "react-icons/vsc";
import "./../index.css"
import { RiSearch2Line } from "react-icons/ri";
import {HiOutlineArrowUpRight} from "react-icons/hi2";
import { RiGoogleLine } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";

function Sidebar({ activeMarkerTitle, activeMarkerImages, sidebarWidth, setSidebarWidth, activeLatLong, setActiveMarkerLat, setActiveMarkerLng, setRecentMarkerLat, setRecentMarkerLng, setCenterOnMarker, setMarkerClicked }) {
  const sidebarDiv = document.getElementsByClassName("sidebar")
  useEffect(() => {
    if (sidebarWidth === "sidebar") {
      const sidebarDiv = document.getElementsByClassName('sidebar')[0];
      sidebarDiv.scrollTo({
        top: 0,
      });
    }
  }, [sidebarWidth]);
  return (
    
    <div id="sidebar" className={sidebarWidth}>
      <div className="sidebar-header">
        <div className="sidebar-header-title">
          <div className="sidebar-heading">
            <div className="sidebar-header-text" onClick={() => {
              window.open("https://www.google.com/search?q=" + activeMarkerTitle, '_blank')
            }}>
              {activeMarkerTitle}
              <IoSearchOutline className="google-button"/>
            </div>
            <div className="sidebar-header-buttons">
            <VscChromeClose className="close-button" onClick={() => {
              setSidebarWidth("sidebar-collapsed")
              document.documentElement.style.setProperty("--leaflet-offset", "0%")
              setRecentMarkerLat(activeLatLong.lat)
              setRecentMarkerLng(activeLatLong.long)
              setActiveMarkerLat(1000)
              setActiveMarkerLng(1000)
              setCenterOnMarker(true)
              setMarkerClicked(false)
              
            }} />
            </div>         
          </div>
        </div>
      </div>

      {activeMarkerImages.map(element => (
        <>
          <div className="content-container">
            <img src={element.link} className="img-style" alt=""></img>
            <div className="post-info">
              <div className={element.date === "" ? "post-date-disable" : "post-date"}>
                <span className="basic-text">  date: {element.date} </span>
              </div>
              <div className={element.date === "" ? "post-link-disabled-date" : "post-link"}
              onClick={
                () => {
                  window.open(element.pageurl, '_blank')
                }
               }
              >
                <span className="basic-text"> View on Tumblr </span>
                <HiOutlineArrowUpRight className="post-button"
                />
              </div>
            </div>
           
              <span className={element.desc === "" ? "post-text-disabled": "post-text"}>
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