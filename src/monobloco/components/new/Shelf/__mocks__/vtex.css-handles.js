import React from 'react'

export const useCssHandles = cssHandles => {
  const handles = {}
  cssHandles.forEach(handle => {
    handles[handle] = handle
  })

  return handles
}

export function applyModifiers(baseClass, modifier) {
  return `${baseClass}--${modifier}`
}

export const withCssHandles = (
  handles
) => (
  Component
) => {
  const EnhancedComponent = props => {
    const cssHandles = useCssHandles(handles)

    return <Component cssHandles={cssHandles} {...props} />
  }

  const displayName = Component.displayName || Component.name || 'Component'
  EnhancedComponent.displayName = `withCssHandles(${displayName})`
  EnhancedComponent.propTypes = Component.propTypes
  return EnhancedComponent
}
