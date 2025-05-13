import { LatLng } from 'leaflet'
import { features } from "./local_data/Libraries.json";


export function coordsToLatLang (coords: number[]): LatLng {
  return new LatLng(coords[1], coords[0]);
}

export function getFeatures() {
    return {
        libraries: features.map(({geometry}) => coordsToLatLang(geometry.coordinates))
    }
}