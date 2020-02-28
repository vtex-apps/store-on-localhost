import React, { Component } from 'react'

import Button from '../Button'
import { withForwardedRef } from '../../modules/withForwardedRef'

class ButtonWithIcon extends Component<any> {
  static defaultProps = {
    iconPosition: 'left',
  }

  render() {
    const { icon, iconPosition, size, children } = this.props

    const hasIconOnly = !children

    let iconMargin
    let paddingOffset

    switch (size) {
      case 'small':
        iconMargin = 2
        paddingOffset = 1
        break
      case 'large':
        iconMargin = 4
        paddingOffset = 3
        break
      default:
        iconMargin = 3
        paddingOffset = 2
        break
    }

    return (
      <Button {...this.props} icon={false} iconOnly={hasIconOnly}>
        {hasIconOnly ? (
          icon
        ) : (
          <span
            className={`flex items-center ${
              iconPosition === 'left'
                ? `nr${paddingOffset}`
                : `nl${paddingOffset}`
            }`}>
            {icon && iconPosition === 'left' && (
              <div
                className={`mr${iconMargin} nl${iconMargin} flex items-center`}>
                {icon}
              </div>
            )}
            <div>{children}</div>
            {icon && iconPosition === 'right' && (
              <div
                className={`ml${iconMargin} nr${iconMargin} flex items-center`}>
                {icon}
              </div>
            )}
          </span>
        )}
      </Button>
    )
  }
}

export default withForwardedRef(ButtonWithIcon) as any
