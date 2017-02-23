import apidocs from '../apidocs'
import templates from './templates'
import fs from 'fs'
import path from 'path'

const dest = path.join(__dirname, '..', 'module')

// Generate all the module files
for (const module of apidocs.modules) {
  module.methods = mkmethods(module)

  // Fix tls module's name
  if (module.name === 'tls_(ssl)') {
    module.name = 'tls'
  }

  const compiled = templates.get('module')({ module })
  const target = path.join(dest, `${module.name}.js`)
  // eslint-disable-next-line no-sync
  fs.writeFileSync(target, compiled, 'utf8')
}

// Generate index.js
const compiled = templates.get('index')({ modules: apidocs.modules })
const target = path.join(dest, 'index.js')
// eslint-disable-next-line no-sync
fs.writeFileSync(target, compiled, 'utf8')


function mkmethods(definition) {
  const result = []
  const methods = []

  // Most modules have their methods defined directly like this...
  for (const method of definition.methods || []) {
    methods.push(method)
  }

  // But sometimes (like child_process) the module is separated into several "modules"
  // (documentation parts) which have their own method definitions.
  for (const module of definition.modules || []) {
    for (const method of module.methods || []) {
      methods.push(method)
    }
  }

  // Check if this method accepts a callback. We can detect that by checking the last arg's type
  for (const method of methods) {
    const signatures = method.signatures[0] || []
    const last = signatures.params[signatures.params.length - 1] || {}

    if (last.type !== 'Function') {
      continue
    }

    // The last arg is a callback - remove it from the function args so it is not added to the
    // generated docblock (we are converting the API to be promise-based, remember?)
    signatures.params.pop()
    result.push(method)
  }

  return result
}
