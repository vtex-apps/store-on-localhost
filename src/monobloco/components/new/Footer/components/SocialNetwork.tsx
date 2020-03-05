import React from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import formatIOMessage from '../../NativeTypes/formatIOMessage'
import useCssHandles from '../../CssHandles/useCssHandles'
import applyModifiers from '../../CssHandles/applyModifiers'

import withImage from './withImage'

interface SocialNetworkProps extends WrappedComponentProps {
  imageSrc: string
  showInColor: boolean
  url: string
  name: string
}

const CSS_HANDLES = ['socialNetworkLink', 'socialNetworkImage'] as const

/**
 * Shows an image for an specific social network
 */
const SocialNetwork: React.FC<SocialNetworkProps> = ({
  imageSrc,
  url,
  name,
  intl,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  if (!imageSrc) {
    return null
  }

  const normalizedName = String(name).toLowerCase()

  return (
    <a
      href={formatIOMessage({ id: url, intl })}
      target="_blank"
      rel="noopener noreferrer"
      className={`${handles.socialNetworkLink} ${applyModifiers(
        handles.socialNetworkLink,
        normalizedName
      )} c-muted-1 w2 h2 mh2 flex items-center`}
    >
      <img
        className={`${handles.socialNetworkImage} ${applyModifiers(
          handles.socialNetworkImage,
          normalizedName
        )}`}
        src={imageSrc}
        alt={formatIOMessage({ id: name, intl })}
        title={formatIOMessage({ id: name, intl })}
      />
    </a>
  )
}

SocialNetwork.displayName = 'SocialNetwork'

const getImagePathFromProps = ({ name, showInColor }: SocialNetworkProps) =>
  `${name.toLowerCase()}${showInColor ? '' : '-bw'}.svg`

export default withImage(getImagePathFromProps)(injectIntl(SocialNetwork))
