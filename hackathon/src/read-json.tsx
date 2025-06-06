import { LatLng } from 'leaflet'
import { features as libFeatures} from "./local_data/Libraries.json";


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
            [timeout:180]
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
    
    const schools = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
        method: "POST",
        // The body contains the query
        body: "data="+ encodeURIComponent(`
            [out:json]
            [timeout:180]
            ;
            area(id:3600106956)->.searchArea
            ;

            (
                way["amenity"="school"](area.searchArea);
            );
            out geom;
        `)
    },
    ).then(
        (data)=>data.json()
    )

    const gardens = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
        method: "POST",
        // The body contains the query
        body: "data="+ encodeURIComponent(`
            [out:json]
            [timeout:180]
            ;
            area(id:3600106956)->.searchArea;

            (
            nwr["leisure"="park"](if: length() > 100)(area.searchArea);
            way["natural"="wood"](if: length() > 100)(area.searchArea);
            );
            out geom;
            make stat total_length=sum(length()),section_lengths=set(length());
            out;
        `)
    },
    ).then(
        (data)=>data.json()
    )

    console.log(gardens)

    return {
        "libraries": libFeatures.map(({geometry}) => coordsToLatLang(geometry.coordinates)),
        "hospitals": flattenOSMData(hospitals.elements),
        "schools": flattenOSMData(schools.elements),
        "gardens": flattenOSMData(gardens.elements),
    }
}

export async function getNeighborhoods() {

    const neighborhoods = await fetch(
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
                nwr[place=suburb](area.searchArea);
            );
            out geom;
        `)
    },
    ).then(
        (data)=>data.json()
    )

    return flattenOSMData(neighborhoods.elements)
}

type Feature = {
    type?: string;
    bounds: {maxlat: number, minlat: number, maxlon: number, minlon: number}; 
    lat: number; 
    lon: number; 
}

function flattenOSMData(data: Feature[]){
    const list: LatLng[] = [];
    
    data.forEach((feature: Feature) => {
        if(feature.type == 'way' || feature.type == 'relation'  || feature.type == 'polygon'){
            list.push(
                latLangToLatLang(
                    {
                        lat: (feature.bounds.maxlat + feature.bounds.minlat)/2, 
                        lon: (feature.bounds.maxlon + feature.bounds.minlon)/2
                    }
                )
            )
        } else if (feature.type == 'node')
        {
            list.push(latLangToLatLang(feature))
        }
    });
    
    return list
}