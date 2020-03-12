// process.env.NODE_ENV = 'production'
process.env.NODE_ENV = 'debug'

console.log('starting server... 🚀')

require('@babel/register')({
  ignore: [ /(node_modules)/ ],
  extensions: ['.tsx', '.ts', '.js', '.jsx'],
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    'babel-plugin-css-modules-transform',
    'babel-plugin-macros',
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-transform-regenerator',
  ]
})

const regeneratorRuntime = require('regenerator-runtime')

require('./server/index.ts')