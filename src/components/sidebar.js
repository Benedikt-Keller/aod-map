import React from "react";
import { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import "./../index.css"
import { RiSearch2Line } from "react-icons/ri";
import {HiOutlineArrowUpRight} from "react-icons/hi2";
import { RiGoogleLine } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { SlArrowRight, SlArrowLeft} from "react-icons/sl";

function Sidebar({ 
  activeMarkerTitle, 
  activeMarkerImages, 
  sidebarWidth, 
  setSidebarWidth, 
  activeLatLong, 
  setActiveMarkerLat, 
  setActiveMarkerLng, 
  setRecentMarkerLat, 
  setRecentMarkerLng, 
  setCenterOnMarker, 
  setMarkerClicked,
  sidebarLoading,
  setSidebarLoading }) {
  
    const sidebarDiv = document.getElementsByClassName("sidebar")

    setTimeout(() => {
      document.documentElement.style.setProperty('--show-content', "visible")
      document.documentElement.style.setProperty('--show-loading', "none")
    }, 800)
  useEffect(() => {
    if (sidebarWidth === "sidebar") {
      const sidebarDiv = document.getElementsByClassName('sidebar')[0];
      sidebarDiv.scrollTo({
        top: 0,
      });
    }
  }, [sidebarWidth]);
  return (
    <>
    <div className="sidebar-line"> </div>
    <div className="sidebar-rest" onClick={() => {
        setSidebarWidth("sidebar");
        setCenterOnMarker(false);
        setMarkerClicked(true);
      } }>
      <div className="sidebar-rest-text"> Sidebar</div>
      <SlArrowRight className="sidebar-arrow" />
    </div>

    <div id="sidebar" className={sidebarWidth}>
        <>
          {(
            <><div className="sidebar-header">
              <div className="sidebar-header-title">
                <div className="sidebar-heading">
                  <div className="sidebar-header-text" onClick={() => {
                    window.open("https://www.google.com/search?q=" + activeMarkerTitle, '_blank');
                  } }>
                    {activeMarkerTitle}
                    <div className="search-button-container">
                      <IoSearchOutline className="google-button" />
                    </div>
                  </div>
                  <div className="sidebar-header-buttons">
                    <div className="close-button-container" onClick={() => {
                        setSidebarWidth("sidebar-collapsed");
                        document.documentElement.style.setProperty("--leaflet-offset", "0%");
                        setRecentMarkerLat(activeLatLong.lat);
                        setRecentMarkerLng(activeLatLong.long);
                        setActiveMarkerLat(1000);
                        setActiveMarkerLng(1000);
                        setCenterOnMarker(true);
                        setMarkerClicked(false);

                      } }>
                      <SlArrowLeft className="close-button"/>
                    </div>

                  </div>
                </div>
              </div>

            </div>

              <div className="loading-container">
                <span className="loading-text"> loading</span>
                <div className="loading-icon-sidebar"></div>
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
                        onClick={() => {
                          window.open(element.pageurl, '_blank');
                        } }
                      >
                        <span className="underlined-text"> View on Tumblr </span>
                        <div className="post-button-container">
                        <HiOutlineArrowUpRight className="post-button" />
                        </div>
                      </div>
                    </div>

                    <span className={element.desc === "" ? "post-text-disabled" : "post-text"}>
                      {element.desc}
                    </span>
                  </div>

                </>
              ))}

            </>

          )}
        </>



      </div></>

  )

}

export default Sidebar;