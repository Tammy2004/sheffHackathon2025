// @ts-nocheck 

import { MapContainer, TileLayer, Marker, LayersControl, Popup, Circle, FeatureGroup, Rectangle, LayerGroup } from 'react-leaflet';
import './App.css'

import { getFeatures } from "./read-json"
import { LatLng, type LatLngExpression } from 'leaflet'
import { useEffect, useState } from 'react'
import { clusterNeighborhoods } from './cluster-points'

import L from "leaflet";
import 'leaflet/dist/leaflet.css';


import hospital from "./assets/images/hospital.png";
import bookshelf from "./assets/images/bookshelf.png";
import school from "./assets/images/school.png";
import gardening from "./assets/images/gardening.png";

function App() {
  const tempArray: LatLng[] = [];
  const [features, setFeatures] = useState({0: {points: []}, 1: {points: []}, 2: {points: []}});
  const hospitalIcon = L.icon ({
    iconUrl : hospital,
    iconSize : [35,35], // size of the icon
    iconAnchor : [22,94], // point of the icon which will correspond to marker's location
    popupAnchor : [-3, -76] // point from which the popup should open relative to the iconAnchor
  })
  const libraryIcon = L.icon({
    iconUrl : bookshelf,
    iconSize : [35,35], // size of the icon
    iconAnchor : [22,94], // point of the icon which will correspond to marker's location
    popupAnchor : [-3, -76] // point from which the popup should open relative to the iconAnchor
  })
  const gardenIcon = L.icon ({
    iconUrl : gardening,
    iconSize : [35,35], // size of the icon
    iconAnchor : [22,94], // point of the icon which will correspond to marker's location
    popupAnchor : [-3, -76] // point from which the popup should open relative to the iconAnchor
  })
  const schoolIcon = L.icon ({
    iconUrl : school,
    iconSize : [35,35], // size of the icon
    iconAnchor : [22,94], // point of the icon which will correspond to marker's location
    popupAnchor : [-3, -76] // point from which the popup should open relative to the iconAnchor
  })

  useEffect(() => {
    clusterNeighborhoods().then((features) => setFeatures(features))
  }, []);

  const hospitalMarkers = features[0].points.map((x: LatLngExpression) => {
    return(
      <>
        <Marker 
          position={x}
          icon={hospitalIcon}></Marker>
      </>
    );
  });
  const libraryMarkers = features[1].points.map((x: LatLngExpression) => {
    return(
      <>
        <Marker 
          position={x}
          icon={libraryIcon}></Marker>
      </>
    );
  });
  const schoolMarkers = features[2].points.map((x: LatLngExpression) => {
    return(
      <>
        <Marker 
          position={x}
          icon={schoolIcon}></Marker>
      </>
    );
  });

  // const gardenMarkers = features.gardens.map((x: LatLngExpression) => {
  //   return(
  //     <>
  //       <Marker 
  //         position={x}
  //         icon={gardenIcon}></Marker>
  //     </>
  //   );
  // });

  const displayMarker = () => {

  };
  return (
  <>
    <MapContainer center={[53.3786, -1.4717]} zoom={13} scrollWheelZoom={true} id="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayersControl position="topright">
      <LayersControl.Overlay checked name="Hospitals">
        <LayerGroup>
          {hospitalMarkers}
        </LayerGroup>
      </LayersControl.Overlay>
      {/* <LayersControl.Overlay checked name="Parks/Woods">
        <LayerGroup>
          {gardenMarkers}
        </LayerGroup>
      </LayersControl.Overlay> */}
      <LayersControl.Overlay checked name="Libraries">
        <LayerGroup>
          {libraryMarkers}
        </LayerGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay checked name="Schools">
        <LayerGroup>
          {schoolMarkers}
        </LayerGroup>
      </LayersControl.Overlay>
    </LayersControl>

    </MapContainer>


  </>
  )
}

export default App
