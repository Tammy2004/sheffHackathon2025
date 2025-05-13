import { LatLng } from 'leaflet'
import { features } from "./local_data/Libraries.json";


export function coordsToLatLang (coords: number[]): LatLng {
  return new LatLng(coords[1], coords[0]);
}

export function latLangToLatLang (coords: {lat: number, lon: number }): LatLng {
  return new LatLng(coords.lat, coords.lon);
}

export async function getFeatures() {

    const hospitals = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
        method: "POST",
        // The body contains the query
        body: "data="+ encodeURIComponent(`
            [out:json]
            [timeout:90]
            ;
            area(id:3600106956)->.searchArea
            ;

            (
            node["amenity"="hospital"](area.searchArea);
            node["healthcare"="hospital"](area.searchArea);
            nwr["healthcare"="doctor"](area.searchArea);
            node["building"="hospital"](area.searchArea);
            );
            out geom;
        `)
    },
    ).then(
        (data)=>data.json()
    )
    
    console.log(hospitals)

    return {
        libraries: features.map(({geometry}) => coordsToLatLang(geometry.coordinates)),
        hospitals: flattenOSMData(hospitals.elements)
            
    }
}

function flattenOSMData(data: { geometry: { lat: number; lon: number; }[]; type: string; }[]){
    const list: LatLng[] = [];
    
    data.forEach((feature: { geometry: { lat: number; lon: number; }[]; type: string; }) => {
        if(feature.type == 'way' || feature.type == 'relation'){
            feature.geometry.forEach((point: { lat: number; lon: number; }) => {
                list.push(latLangToLatLang(point))
            })
        }
    });
    
    return list
}


            // [out:json]
            // [timeout:90];

            // {{geocodeArea:Sheffield}}->.searchArea;

            // (
            //     node["amenity"="hospital"](area.searchArea);
            //     node["healthcare"="hospital"](area.searchArea);
            //     nwr["healthcare"="doctor"](area.searchArea);
            //     node["building"="hospital"](area.searchArea);
            // );
            // out geom;