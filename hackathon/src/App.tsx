// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { MapContainer } from 'react-leaflet'
import { TileLayer } from 'react-leaflet'
import { Marker } from 'react-leaflet'
import './App.css'

import { features } from "./local_data/Libraries.json";
import { LatLng } from 'leaflet'

function flipCoordinates (coords: number[]): LatLng {
  return new LatLng(coords[1], coords[0]);
}

function App() {
  // const [count, setCount] = useState(0)
  const markers = features.map(({geometry}) => {
    return(
      <>
        <Marker position={flipCoordinates(geometry.coordinates)}></Marker>
      </>
    );
  });

  return (
  <>
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} id="map" >
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
