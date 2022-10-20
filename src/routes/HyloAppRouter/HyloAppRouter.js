import React from 'react'
import { Route, Switch } from 'react-router-dom'
import HyloEditorMobile from 'components/HyloEditor/HyloEditorMobile'

export default function HyloAppRouter () {
  return (
    <Switch>
      <Route
        path='/hyloApp/editor'
        component={routeProps => (
          <HyloEditorMobile {...routeProps} />
        )}
      />
    </Switch>
  )
}
