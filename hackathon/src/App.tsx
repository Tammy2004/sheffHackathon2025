// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { MapContainer } from 'react-leaflet'
import { TileLayer } from 'react-leaflet'
import { Marker } from 'react-leaflet'
import './App.css'

import { getFeatures } from "./read-json"
import type { LatLngExpression } from 'leaflet'

function App() {
  const markers = getFeatures().libraries.map((x: LatLngExpression) => {
    return(
      <>
        <Marker position={x}></Marker>
      </>
    );
  });

  return (
  <>
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} id="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers}
    </MapContainer>
  </>
  )
}

export default App
