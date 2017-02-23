import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
import helpers from './hbs-helpers'

handlebars.registerHelper(helpers)

// Read all templates as strings from current directory
const templates = new Map()

// eslint-disable-next-line no-sync
fs
  .readdirSync(__dirname)
  .map(path.parse)
  .filter(file => file.ext === '.hbs')
  .map(file => {
    // eslint-disable-next-line no-sync
    file.contents = fs.readFileSync(path.join(__dirname, path.format(file)), 'utf8')
    return file
  })
  .forEach(file => {
    templates.set(file.name, handlebars.compile(file.contents, {
      noEscape: true,
    }))
  })

export default templates
