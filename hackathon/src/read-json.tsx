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
    console.log(flattenOSMData(hospitals.elements))

    return {
        libraries: features.map(({geometry}) => coordsToLatLang(geometry.coordinates)),
        hospitals: flattenOSMData(hospitals.elements)
            
    }
}

function flattenOSMData(data: { type?: string; bounds: { maxlat: number; minlat: number; maxlon: number; minlon: number; }; lat: number; lon: number; }[]){
    const list: LatLng[] = [];
    
    data.forEach((feature: { type?: string; bounds: {maxlat: number, minlat: number, maxlon: number, minlon: number}; lat: number; lon: number; }) => {
        if(feature.type == 'way' || feature.type == 'relation'  || feature.type == 'polygon'){
            list.push(
                latLangToLatLang(
                    {
                        lat: (feature.bounds.maxlat + feature.bounds.minlat)/2, 
                        lon: (feature.bounds.maxlon + feature.bounds.minlon)/2
                    }
                )
            )
        } else {
            list.push(latLangToLatLang(feature))
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