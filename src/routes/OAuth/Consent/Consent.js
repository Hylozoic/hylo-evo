import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash/fp'
import { formatError } from 'routes/NonAuthLayoutRouter/util'
import Button from 'components/Button'
import './Consent.scss'

export default function Consent (props) {
  const [error, setError] = useState(null)
  const { t } = useTranslation()

  const submit = () => {
    props.confirm().then((results) => {
      if (results.error) {
        setError(results.error)
        console.error(t('Something weird happened during consent process'), results.error)
      } else if (results.payload && results.payload.redirectTo) {
        window.location.href = results.payload.redirectTo
      } else {
        console.error(t('Something weird happened during consent process'))
      }
    })
  }

  const cancel = () => {
    props.cancel().then((results) => {
      window.location.href = results.payload.redirectTo
    })
  }

  const { appName, className, missingOIDCClaims, missingOIDCScopes, missingResourceScopes, offlineAccessRequested, previousAuthsOnly } = props

  return (
    <div className={className}>
      <div styleName='formWrapper'>
        <h1 styleName='title'>{t('{{appName}} wants access to your Hylo account', { appName })}</h1>
        {error && formatError(error, 'Login')}

        <div>
          {previousAuthsOnly
            ? <p>{t('{{appName}} is asking you to confirm previously given authorization', { appName })}</p>
            : ''
          }

          {!isEmpty(missingOIDCScopes)
            ? <div><h3>{t('This will allow {{appName}} to:', { appName })}</h3>
              <ul>
                {missingOIDCScopes.map((scope) =>
                  <li key={scope}>
                    {scope === 'profile' ? t('Access your profile, including your name and image.')
                      : scope === 'address' ? t('Access to your physical address.')
                        : scope === 'email' ? t('Access to your email address.')
                          : scope === 'phone' ? t('Access to your phone number.')
                            : ''}
                  </li>
                )}
              </ul>
            </div>
            : ''
          }

          {!isEmpty(missingOIDCClaims)
            ? <div>
              <h3>{t('Claims:')}</h3>
              <ul>
                {missingOIDCClaims.map((claim) => {
                  return <li key={claim}>{claim}</li>
                })}
              </ul>
            </div>
            : ''
          }

          {!isEmpty(missingResourceScopes)
            ? Object.keys(missingResourceScopes).map(indicator => <div key={indicator}>
              <h3>{indicator}</h3>
              <ul>
                {missingResourceScopes[indicator].map(scope => <li key={scope}>{scope}</li>)}
              </ul>
            </div>)
            : ''
          }

          {offlineAccessRequested
            ? <div>
              {t('{{appName}} is asking to have offline access to Hylo', { appName })}
              { /* XXX: Don't know currently how to tell here if the client is asking for offline_access but already granted it
                {isEmpty(missingOIDCScopes) || !missingOIDCScopes.includes('offline_access')
                ? <p>(which you've previously granted)</p>
                : ''
              } */}
            </div>
            : ''
          }
        </div>

        <Button label={t('Cancel')} color='dark-gray' narrow onClick={cancel} />

        <Button styleName='submit' label={t('Allow')} onClick={submit} />
      </div>
    </div>
  )
}
