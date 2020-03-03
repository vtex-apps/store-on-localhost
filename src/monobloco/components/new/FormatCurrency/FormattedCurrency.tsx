import React, { FC, Fragment } from 'react'
import { useRuntime } from '../../../../vtex.render-runtime'
import { injectIntl, WrappedComponentProps } from 'react-intl'

const FormattedCurrency: FC<FormattedCurrencyProps & WrappedComponentProps> = ({
  value,
  intl,
}) => {
  const { culture } = useRuntime()

  const number = intl.formatNumber(value, {
    style: 'currency',
    currency: culture.currency,
    ...(culture.customCurrencyDecimalDigits != null
      ? { minimumFractionDigits: culture.customCurrencyDecimalDigits }
      : {}),
  })

  return (
    <Fragment>
      {number}
    </Fragment>
  )
}

interface FormattedCurrencyProps {
  value: number
}

export default injectIntl(FormattedCurrency)
