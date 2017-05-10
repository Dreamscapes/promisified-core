import 'source-map-support/register'
import apidocs from '../apidocs'
import templates from './templates'
import fs from 'fs'
import path from 'path'

const dest = path.join(__dirname, '..', 'module')
// These modules are not "modules" per se, they are modules in the documentation. Skip!
const ignore = [
  'c/c++_addons',
  'tracing',
  'deprecated_apis',
]
const modules = apidocs.modules.filter(module => !ignore.includes(module.name))

// Generate all the module files
for (const module of modules) {
  // Fix tls module's name
  if (module.name === 'tls_(ssl)') {
    module.name = 'tls'
  }

  module.name = module.name.toLowerCase()
  module.methods = mkmethods(module)

  generate({
    template: 'module',
    data: { module },
    name: module.name,
  })
}

// Generate index.js
generate({
  template: 'index',
  data: { modules },
  name: 'index',
})


/**
 * Compile the module using the given template and data and save it to the filesystem
 *
 * @private
 * @param     {Object}    [opts={}]         Options for the generation
 * @param     {String}    opts.template     The template name to use
 * @param     {Object}    opts.data         The data to send to the template
 * @param     {String}    opts.name         The module's name (will be used as the module filename)
 * @return    {void}
 */
function generate(opts = {}) {
  const contents = templates.get(opts.template)(opts.data)
  const filename = path.join(dest, `${opts.name}.js`)
  // eslint-disable-next-line no-sync
  fs.writeFileSync(filename, contents, 'utf8')
}

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
