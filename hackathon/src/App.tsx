// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { MapContainer } from 'react-leaflet'
import { TileLayer } from 'react-leaflet'
import { Marker } from 'react-leaflet'
import './App.css'

import { getFeatures } from "./read-json"
import { LatLng, type LatLngExpression } from 'leaflet'
import { useEffect, useState } from 'react'


function App() {
  const tempArray: LatLng[] = [];
  const [features, setFeatures] = useState({hospitals: tempArray, libraries: tempArray});
  
  useEffect(() => {
    getFeatures().then(features => setFeatures(features));
  }, []);

  const hospitalMarkers = features.hospitals.map((x: LatLngExpression) => {
    return(
      <>
        <Marker position={x}></Marker>
      </>
    );
  });
  const libraryMarkers = features.libraries.map((x: LatLngExpression) => {
    return(
      <>
        <Marker position={x}></Marker>
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
    </MapContainer>
  </>
  )
}

export default App
