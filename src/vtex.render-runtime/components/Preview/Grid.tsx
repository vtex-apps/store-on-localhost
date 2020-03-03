import React from 'react'
import { ContentLoader, Rect } from './ContentLoader'
import Box from './Box'
import { useSSR } from '../../index'

interface Props {
  width: number | string
  height: number | string
}

const Grid = ({ width, height }: Props) => {
  const isSSR = useSSR()

  if (isSSR || typeof width === 'string' || typeof height === 'string') {
    return <Box width={width} height={height} />
  }

  // TODO: make these values configurable
  const itemWidth = 250
  const itemHeight = 400
  const minSpacingX = 10
  const minSpacingY = 30
  const itemsNumX = Math.floor(width / (itemWidth + minSpacingX))
  const itemsNumY = Math.floor(height / (itemHeight + minSpacingY))
  // distributes the remaining available space between each item of the grid
  const spacingX =
    (width - itemsNumX * itemWidth) / (itemsNumX > 1 ? itemsNumX - 1 : 2)
  const spacingY =
    (height - itemsNumY * itemHeight) / (itemsNumY > 1 ? itemsNumY - 1 : 2)

  return (
    <ContentLoader width={width} height={height}>
      {Array.from({ length: itemsNumX }).map((_, x) =>
        Array.from({ length: itemsNumY }).map((__, y) => (
          <Rect
            key={`${x}-${y}`}
            x={x * (itemWidth + spacingX)}
            y={y * (itemHeight + spacingY)}
            width={itemWidth}
            height={itemHeight}
          />
        ))
      )}
    </ContentLoader>
  )
}

export default Grid
