import * as React from 'react'
import ReactDOM from 'react-dom'
import { Container, Form, Header } from 'semantic-ui-react'
import colourlovers from './lib/colourlovers'

function download (ev, paletteId) {
  ev.preventDefault()
  colourlovers.download(paletteId)
}

const App = React.memo(() => {
  const [ paletteId, setPaletteId ] = React.useState('')
  return (
    <>
      <Container text>
        <Header as='h1'>.sketchpalette generator</Header>
        <p>
          Find an amazing palette on <a href='https://www.colourlovers.com/palettes'>colourlovers.com</a>
          &nbsp; and generate a <a href='https://github.com/andrewfiorillo/sketch-palettes'>Sketch Palettes</a>
          &nbsp; compatible file for importing into <a href='https://www.sketch.com/'>Sketch</a>.
        </p>
        <Form onSubmit={ev => download(ev, paletteId)}>
          <Form.Group>
            <Form.Input
              placeholder='Palette ID or URL' 
              width={10}
              value={paletteId}
              onChange={(ev, { value }) => setPaletteId(value)}
            />
            <Form.Button type='submit'>Submit</Form.Button>
          </Form.Group>
        </Form>
      </Container>
    </>
  )
})

ReactDOM.render(<App />, document.getElementById('root'))
