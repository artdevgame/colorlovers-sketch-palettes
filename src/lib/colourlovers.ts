import hexRgb from 'hex-rgb'
import proxy from './proxy'

function getPaletteId (urlOrId) {
  try {
    if (!isNaN(urlOrId)) return urlOrId
    const [ match, id ] = urlOrId.match(/palette\/([0-9]+)/)
    return Number(id)
  } catch (err) {
    throw new Error('Unable to parse colourlovers paletteId')
  }
}

async function download (urlOrId) {
  try {
    const paletteId = getPaletteId(urlOrId)
    const sketchPalettes = await fetch(await proxy(`https://raw.githubusercontent.com/andrewfiorillo/sketch-palettes/master/Sketch%20Palettes.sketchplugin/Contents/Sketch/manifest.json`))
    const manifest = await sketchPalettes.json()
    const palettes = await fetch(await proxy(`/colourlovers-api/palette/${paletteId}?format=json`))
    const [ selectedPalette ] = await palettes.json()
    const colors = selectedPalette.colors.map(hex => hexRgb(hex)).map(rgba => ({
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
    const encodedFileData = encodeURIComponent(JSON.stringify(fileData))
    const dataURI = `data:text/json;charset=utf-8,${encodedFileData}`
    const downloadEl = document.createElement('a')
    const filename = `${selectedPalette.title.replace(/[^a-z0-9]/i, '').toLowerCase()}.sketchpalette`

    downloadEl.setAttribute('href', dataURI)
    downloadEl.setAttribute('download', filename)
    downloadEl.click()
  } catch (err) {
    console.warn(err.message)
  }
}

export default {
  download
}