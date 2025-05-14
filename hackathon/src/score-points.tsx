// @ts-nocheck 
import { getFeatures, getNeighborhoods } from "./read-json"

export async function scoreNeighborhoods(features) 
{
    console.log("Calling overpass api...")

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
    let distances = {}
    const maxDist = 0.0001;

    features.forEach(feature => {
        const dist = getDistance(neighborhood, feature);
        if (dist <= maxDist) { // Only consider distances within maxDist
            if (!distances[feature.feature]) {
                distances[feature.feature] = [];
            }
            distances[feature.feature].push(dist);
        }
    });

    let score = 0;

    const keys = Object.keys(distances);

    keys.forEach(key => {
        if (distances[key].length > 0) { // Ensure there are distances to calculate
            const avgDistance = distances[key].reduce((acc, val) => acc + val, 0) / distances[key].length;
            score += avgDistance;
        }
    });

    return score;


    // let score = 0;
    
    // const keys = Object.keys(minDistances);

    // keys.forEach(key => {
    //     score += minDistances[key]
    // });

    // return score;
}

