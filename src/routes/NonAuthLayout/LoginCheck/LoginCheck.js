import React, { useEffect } from 'react'
import Loading from 'components/Loading'

export default function LoginCheck ({ hasCheckedLogin, checkLogin, children }) {
  useEffect(() => {
    if (!hasCheckedLogin) {
      checkLogin()
    }
  })

  if (!hasCheckedLogin) {
    return <Loading type='fullscreen' />
  }

  return children
}
