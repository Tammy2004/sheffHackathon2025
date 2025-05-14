// @ts-nocheck 
import { getFeatures, getNeighborhoods } from "./read-json"

export async function scoreNeighborhoods() 
{
    console.log("Calling overpass api...")

    const features = await getFeatures()
    const keys = Object.keys(features);
    
    console.log("Scoring Neighborhoods")
    const neighborhoods = await getNeighborhoods();

    const points = keys.flatMap(key => {
        return features[key].map((element: { lat: any; lng: any; }) => {
            return {lat: element.lat, lng: element.lng, feature: key}
        })
    });
    
    const scores = neighborhoods.map(neighborhood => {
        return {point: neighborhood, score: scoreNeighborhood(neighborhood, points)}
    });
    console.log(scores)

    let minScore = 1;
    let maxScore = 0;
    scores.forEach(x => {
        minScore = Math.min(minScore,x.score)
        maxScore = Math.max(maxScore,x.score)
    })

    const normalScores = scores.map(x => {
        x.score = (x.score - minScore)/(maxScore - minScore)
        return x
    }) 

    return normalScores
}

function getDistance(a,b){
    return (a.lat - b.lat)**2 + (a.lng - b.lng)**2
}

function scoreNeighborhood(neighborhood, features){
    let minDistances = {}

    features.forEach(feature => {
        const dist = getDistance(neighborhood,feature)
        if(minDistances[feature.feature] == undefined || minDistances[feature.feature] > dist){
            minDistances[feature.feature] = dist
        }
    });

    let score = 0;
    
    const keys = Object.keys(minDistances);

    keys.forEach(key => {
        score += minDistances[key]
    });

    return score;
}

