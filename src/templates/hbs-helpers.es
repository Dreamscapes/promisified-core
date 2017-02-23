import markdown from 'to-markdown'

export default {
  /**
   * Print a type information for JSDoc @member
   *
   * It's difficult from Handlebars to print a raw curly brace, { or }. this helper takes care of
   * that - it takes a type as string and prints {type} back, ie. {String} or {Function}.
   *
   * @param   {String}    type              The JSDoc type to print
   * @param   {Object?}   opts              Optional options
   * @param   {String?}   opts.optional     Adds a `?` to the type, like {String?}
   * @return  {String}                      The JSDoc type, like {String}
   */
  doctype(type = '', opts = {}) {
    return `{${type.replace(/ /g, '')}${opts.hash.optional ? '?' : ''}}`
  },
  markdown(html, opts) {
    return markdown(html, { gfm: true })
      .replace(/\n/g, `\n${opts.hash.linebreak || ''}`)
  },
  props(source = [], opts = {}) {
    const {
      key,
      delimiter,
    } = opts.hash
    const items = []

    for (const obj of source) {
      items.push(obj[key])
    }

    return items.join(delimiter)
  },
}
