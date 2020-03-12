import critical from 'critical'
import { resolve } from 'path'

const dest = resolve(__dirname, '../build/static/css/critical.css')
const src = 'https://storetheme.vtex.com'

critical.generate({
  // Inline the generated critical-path CSS
  // - true generates HTML
  // - false generates CSS
  inline: false,

  // Your base directory
  // base: 'build/',

  // HTML source
  // html: '<html>...</html>',

  // HTML source file
  src,

  // Your CSS Files (optional)
  // css: ['../build/static/css/critical.css'],

  // Viewport width
  width: 1300,

  // Viewport height
  height: 900,

  // Target for final HTML output.
  // use some CSS file when the inline option is not set
  dest,

  // Minify critical-path CSS when inlining
  minify: true,

  // Extract inlined styles from referenced stylesheets
  // extract: true,

  // Complete Timeout for Operation
  timeout: 30000,

  // Prefix for asset directory
  // pathPrefix: '/MySubfolderDocrot',

  // ignore CSS rules
  // ignore: ['font-face',/some-regexp/],

  // overwrite default options
  // ignoreOptions: {}

  penthouse: {
    renderWaitTime: 5000,
    blockJSRequests: false,
  }
})