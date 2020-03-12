import { Request, Response } from '../typings'
import { readFile } from 'fs-extra'
import fetch from 'node-fetch'
import path from 'path'
import React from 'react'
import { renderToStringWithData } from '@apollo/react-ssr'

import { App, createOrHydrateApolloClient } from '../../src/App'

global.window = global
global.fetch = fetch

const filePath = path.resolve(__dirname, '../../build/index.html')


const renderServerSide = async (res: Response, htmlTemplate: string) => {
  const client = createOrHydrateApolloClient()
  
  res.startTime('renderToStringWithData', 'RenderToStringWithData')
  const renderedHTML = await renderToStringWithData(<App client={client}/>)
  res.endTime('renderToStringWithData')

  res.startTime('extractApolloClient', 'Apollo Client Extraction')
  const extracted = client.extract()
  res.endTime('extractApolloClient')

  return htmlTemplate
    .replace('<div id="root"></div>', `<div id="root">${renderedHTML}</div>`)
    .replace('<script id="apolloCache"></script>', `<script id="apolloCache">window.__APOLLO_CACHE__=${JSON.stringify(extracted)}</script>`)
}

const renderClientSide = (htmlTemplate: string) => htmlTemplate

export const render = async (req: Request, res: Response) => {
  try {
    const { __disableSSR: disableSSR } = req.query

    res.startTime('htmlTemplate', 'Read HTML Template')
    const htmlTemplate = await readFile(filePath, { encoding: 'utf8' })
    res.endTime('htmlTemplate')

    let html: string = ''
    if (disableSSR != null) {
      res.startTime('renderClientSide', 'Client Side Rending')
      html = renderClientSide(htmlTemplate)
      res.endTime('renderClientSide')
    } else {
      res.startTime('serverSideRendering', 'Render Server Side')
      html = await renderServerSide(res, htmlTemplate)
      res.endTime('serverSideRendering')
    }
    
    res.send(html)
  } catch (err) {
    if (err) {
        console.error('err', err);
        return res.status(404).end()
    }
  }
}