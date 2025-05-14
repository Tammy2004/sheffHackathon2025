// @ts-nocheck 

import { MapContainer, TileLayer, Marker, LayersControl, Popup, Circle, FeatureGroup, Rectangle, LayerGroup, CircleMarker } from 'react-leaflet';
import './App.css'

import { getFeatures } from "./read-json"
import { LatLng, type LatLngExpression } from 'leaflet'
import { Suspense, useEffect, useState } from 'react'
import { scoreNeighborhoods } from './score-points'

import L from "leaflet";  
import 'leaflet/dist/leaflet.css';
import "leaflet.heat"

import { getNNHeatmap } from "./simple-nn"
import hospital from "./assets/images/hospital.png";
import bookshelf from "./assets/images/bookshelf.png";
import school from "./assets/images/school.png";
import gardening from "./assets/images/gardening.png";

function interpolate(color1, color2, percent) {
  // Convert the hex colors to RGB values
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  // Interpolate the RGB values
  const r = Math.round(r1 + (r2 - r1) * percent);
  const g = Math.round(g1 + (g2 - g1) * percent);
  const b = Math.round(b1 + (b2 - b1) * percent);

  // Convert the interpolated RGB values back to a hex color
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function scoreToColour(score: number){
  return interpolate("#00ff00","#ff0000", score)
}

function App() {
  const tempArray: LatLng[] = [];
  const [hospitalMarkers, setHospitalMarkers] = useState([]);
  const [libraryMarkers, setLibraryMarkers] = useState([]);
  const [schoolMarkers, setSchoolMarkers] = useState([]);
  const [gardenMarkers, setGardenMarkers] = useState([]);

  const [neighborhoods, setNeighborhoods] = useState([{point: {lat: 0, lng: 0}, score: 0}]);

  useEffect(() =>{
    console.log("Map loaded!")
    getFeatures().then(features => {
        setLibraryMarkers(features.libraries.map((x: LatLngExpression) => {
          return(
            <>
              <Marker 
                position={x}
                icon={libraryIcon}></Marker>
            </>
          );
        }))
        setSchoolMarkers(features.schools.map((x: LatLngExpression) => {
          return(
            <>
              <Marker 
                position={x}
                icon={schoolIcon}></Marker>
            </>
          );
        }))

        setHospitalMarkers(features.hospitals.map((x: LatLngExpression) => {
          return(
            <>
              <Marker 
                position={x}
                icon={hospitalIcon}></Marker>
            </>
          );
        }))

        setGardenMarkers(features.gardens.map((x: LatLngExpression) => {
          return(
            <>
              <Marker 
                position={x}
                icon={gardenIcon}></Marker>
            </>
          );
        }))



      scoreNeighborhoods(features).then(x => {
        console.log("Appending heatmap")
        setNeighborhoods(x)
      });
    });
  })

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



      const neighborhoodMarkers = neighborhoods.map((x: LatLngExpression) => {
          return(
            <>
              <CircleMarker 
                radius='10'
                color={scoreToColour(x.score)}
                center={x.point}>
                <Popup>
                {`Score: ${x.score}`}
              </Popup>
              </CircleMarker>
            </>
          );
        });

const handleMapCreated = (map: Map | null) => {
  if (map) {
    
  }
};

  return (
  <>
    <MapContainer center={[53.3786, -1.4717]} zoom={13} scrollWheelZoom={true} id="map" ref={handleMapCreated}> 
    
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
      <LayersControl.Overlay checked name="Parks/Woods">
        <LayerGroup>
          {gardenMarkers}
        </LayerGroup>
      </LayersControl.Overlay>
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
      <LayersControl.Overlay checked name="Neighborhoods">
        <LayerGroup>
      {neighborhoodMarkers}
          
        </LayerGroup>
      </LayersControl.Overlay>
    </LayersControl>
    </MapContainer>


  </>
  )
}

export default App
