const hexRgb = require('hex-rgb')

async function proxy (url) {
  if (process.env.NODE_ENV === 'development') {
    try {
      await fetch('http://localhost:3000')
    } catch (err) {
      throw new Error('Local CORS proxy not started, run `docker-compose up`')
    }
    return `http://localhost:3000/${url}`
  }
  return url
}

async function download (paletteId) {
  try {
    const sketchPalettes = await fetch(await proxy(`https://raw.githubusercontent.com/andrewfiorillo/sketch-palettes/master/Sketch%20Palettes.sketchplugin/Contents/Sketch/manifest.json`))
    const manifest = await sketchPalettes.json()
    const palettes = await fetch(await proxy(`https://www.colourlovers.com/api/palette/${paletteId}?format=json`))
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

    downloadEl.setAttribute('href', dataURI)
    downloadEl.setAttribute('download', `${selectedPalette.title}.sketchpalette`)
    downloadEl.click()
  } catch (err) {
    console.warn(err.message)
  }
}

download(1332140)
