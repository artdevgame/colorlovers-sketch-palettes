const fs = require('fs').promises
const fetch = require('node-fetch')
const hexRgb = require('hex-rgb')

async function run (paletteId) {
  const sketchPalettes = await fetch(`https://raw.githubusercontent.com/andrewfiorillo/sketch-palettes/master/Sketch%20Palettes.sketchplugin/Contents/Sketch/manifest.json`)
  const manifest = await sketchPalettes.json()
  const selectedPalette = await fetch(`https://www.colourlovers.com/api/palette/${paletteId}?format=json`)
  const palettes = await selectedPalette.json()
  const colors = palettes[0].colors.map(hex => hexRgb(hex)).map(rgba => ({
    red: rgba.red / 255,
    green: rgba.green / 255,
    blue: rgba.blue / 255,
    alpha: 1,
  }))
  const fileData = {
    compatibleVersion: '2.0',
    pluginVersion: manifest.version,
    colors,
    gradients: [],
    images: []
  }

  await fs.writeFile('./test.sketchpalette', JSON.stringify(fileData))
}

run(1332140)
