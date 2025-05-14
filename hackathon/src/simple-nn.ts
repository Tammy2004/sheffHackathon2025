// @ts-nocheck 

import * as tf from "@tensorflow/tfjs"
import {scoreNeighborhoods} from "./score-points"


const ALPHA = 0.001
const HIDDEN_SIZE = 4
const model = tf.sequential({
    layers: [
        tf.layers.dense({ inputShape: [2], units: 10, activation: 'relu' }),
      tf.layers.dense({units: 10, activation: 'relu'}),
      tf.layers.dense({units: 40, activation: 'relu'}),
      tf.layers.dense({units: 40, activation: 'relu'}),
      tf.layers.dense({units: 40, activation: 'relu'}),
      tf.layers.dense({units: 10, activation: 'relu'}),
      tf.layers.dense({ units: 1, activation: 'relu' }), // set units to n (TODO)

    ]
   });

export const train = async () => {
  model.compile({ optimizer: tf.train.sgd(ALPHA), loss: "meanSquaredError" })

  console.log("Fetching training data..")
  const data = await scoreNeighborhoods()
  const trainingData = tf.tensor(data.map(x => {
    return [x.point.lat,x.point.lng];
  }))
  const trainingScores = tf.expandDims(tf.tensor(data.map(x => {
    return x.score;
  })),1)

  await model.fit(trainingData, trainingScores, {
    epochs: 200,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        if ((epoch + 1) % 10 === 0) {
          console.log(`Epoch ${epoch + 1}: error: ${logs.loss}`)
        }
      },
    },
  })

  return model;
}

const WIDTH = 0.1
const HEIGHT = 0.1
const DENSITY = 100
const CENTRE = [-1.4717,53.3786]

export async function getNNHeatmap(){
  console.log("Training...")
  const mod = await train()
  let heatmap = []
  console.log("Calculating points...")
  const left = CENTRE[0]-(WIDTH/2);
  for (let x = left; x < left + WIDTH; x +=(WIDTH/DENSITY)) {
    const bottom = CENTRE[1]-(HEIGHT/2);
    for (let y = bottom; y < bottom + HEIGHT; y+=(HEIGHT/DENSITY)) {
      const val = mod.predict(tf.tensor([[y, x]])).dataSync()[0]
      heatmap.push([y,x,val])
    }
  }

    let minScore = 1;
    let maxScore = 0;
    heatmap.forEach(x => {
        minScore = Math.min(minScore,x[2])
        maxScore = Math.max(maxScore,x[2])
    })

    const normalHeatmap = heatmap.map(x => {
        x[2] = (x[2] - minScore)/(maxScore - minScore)
        return x
    }) 

    console.log(normalHeatmap)
    return normalHeatmap
}