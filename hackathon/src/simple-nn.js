import * as tf from "@tensorflow/tfjs"
const DATA = tf.tensor([
  // infections, infected countries
  [2.0, 1.0],
  [5.0, 1.0],
  [7.0, 4.0],
  [12.0, 5.0],
]) //change this (TODO)
const nextDayInfections = tf.expandDims(tf.tensor([5.0, 7.0, 12.0, 19.0]), 1) //change this (TODO)
const ALPHA = 0.001
const HIDDEN_SIZE = 4
const model = tf.sequential({
    layers: [
      tf.layers.conv2d({ filters: 2, kernelSize: 2}),
      tf.layers.dense({units: 10, activation: 'relu'}),
      tf.layers.dense({units: 10, activation: 'relu'}),
      tf.layers.dense({units: 10, activation: 'relu'}),
      tf.layers.conv2d({ filters: 2, kernelSize: 2})
    ]
   });
model.summary()
const train = async () => {
  model.compile({ optimizer: tf.train.sgd(ALPHA), loss: "meanSquaredError" })
  await model.fit(DATA, nextDayInfections, {
    epochs: 200,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        if ((epoch + 1) % 10 === 0) {
          console.log(`Epoch ${epoch + 1}: error: ${logs.loss}`)
        }
      },
    },
  })
  console.log(model.layers[0].getWeights()[0].shape)
  model.layers[0].getWeights()[0].print()
  console.log(model.layers[1].getWeights()[0].shape)
  model.layers[1].getWeights()[0].print()
//   const lastDayFeatures = tf.tensor([[12.0, 5.0]])
//   model.predict(lastDayFeatures).print()
}
if (document.readyState !== "loading") {
  train()
} else {
  document.addEventListener("DOMContentLoaded", train)
}