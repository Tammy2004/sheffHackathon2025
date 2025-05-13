
import { MapContainer } from 'react-leaflet'
import { TileLayer } from 'react-leaflet'
import { Marker } from 'react-leaflet'
import './App.css'

import { getFeatures } from "./read-json"
import { LatLng, type LatLngExpression } from 'leaflet'
import { useEffect, useState } from 'react'
import L from "leaflet";

import hospital from "./assets/images/hospital.png";
import bookshelf from "./assets/images/bookshelf.png";
// import gardening from "./assets/images/gardening.png";
// import school from "../assets/images/school.png";




function App() {
  const tempArray: LatLng[] = [];
  const [features, setFeatures] = useState({hospitals: tempArray, libraries: tempArray});
  var hospitalIcon = L.icon ({
    iconUrl : hospital,
    iconSize : [35,35], // size of the icon
    iconAnchor : [22,94], // point of the icon which will correspond to marker's location
    popupAnchor : [-3, -76] // point from which the popup should open relative to the iconAnchor
  })
  var libraryIcon = L.icon({
    iconUrl : bookshelf,
    iconSize : [35,35], // size of the icon
    iconAnchor : [22,94], // point of the icon which will correspond to marker's location
    popupAnchor : [-3, -76] // point from which the popup should open relative to the iconAnchor
  })
  // var gardenIcon = new Icon ({
  //   iconUrl : 'hackathon\src\assets\images\gardening.png',
  //   iconSize : [35,35], // size of the icon
  //   iconAnchor : [22,94], // point of the icon which will correspond to marker's location
  //   popupAnchor : [-3, -76] // point from which the popup should open relative to the iconAnchor
  // })
  // var schoolIcon = new Icon ({
  //   iconUrl : 'hackathon\src\assets\images\school.png',
  //   iconSize : [35,35], // size of the icon
  //   iconAnchor : [22,94], // point of the icon which will correspond to marker's location
  //   popupAnchor : [-3, -76] // point from which the popup should open relative to the iconAnchor
  // })

  useEffect(() => {
    getFeatures().then(features => setFeatures(features));
  }, []);

  const hospitalMarkers = features.hospitals.map((x: LatLngExpression) => {
    return(
      <>
        <Marker 
          position={x}
          icon={hospitalIcon}></Marker>
      </>
    );
  });
  const libraryMarkers = features.libraries.map((x: LatLngExpression) => {
    return(
      <>
        <Marker 
          position={x}
          icon={libraryIcon}></Marker>
      </>
    );
  });

  return (
  <>
    <MapContainer center={[53.3786, -1.4717]} zoom={13} scrollWheelZoom={false} id="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {libraryMarkers}
      {hospitalMarkers}
      <div className="button-container">
        <button id="Button">Hospital</button>
        <button id="Button">Schools</button>
        <button id="Button">Libraries</button>
        <button id="Button">Gardens</button>
      </div>     
    </MapContainer>


  </>
  )
}

export default App
