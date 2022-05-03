import * as React from 'react'
import { remove, reduce } from 'lodash/fp'

// Sets and persist (until page reload) layout flags set in the layoutFlags
// query param, e.g.:
//
//   `/path?layoutFlags=flag1,flag2`
//
// To keep things tidy the actual flags are prefixed with "Layout", e.g.:
//
// `flag1Layout` and `flag2Layout`
//
// For a flag to set it must be in the VALID_FLAGS whitelist below

const VALID_FLAGS = ['hyloApp', 'hideNav']

export const LayoutFlagsContext = React.createContext()

export function LayoutFlagsProvider ({ children }) {
  const [layoutFlags, setLayoutFlags] = React.useState({})
  const params = new URLSearchParams(window.location.search)
  const layoutFlagsFromURL = remove(flag => !VALID_FLAGS.includes(flag), (params.get('layoutFlags') || '').split(','))

  React.useEffect(() => {
    setLayoutFlags(
      reduce((flags, flag) => {
        flags[`${flag}Layout`] = true
        return flags
      }, {}, layoutFlagsFromURL)
    )
  }, [])

  return <LayoutFlagsContext.Provider value={layoutFlags}>{children}</LayoutFlagsContext.Provider>
}

export function useLayoutFlags () {
  const context = React.useContext(LayoutFlagsContext)

  if (context === undefined) {
    throw new Error('useLayoutFlags must be used within a LayoutFlagsProvider')
  }

  return context
}

export default LayoutFlagsContext
