import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'

const HyloEditorMobile = React.lazy(() => import('components/HyloEditor/HyloEditorMobile'))

export default function HyloAppRouter () {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route
          path='/hyloApp/editor'
          component={routeProps => (
            <HyloEditorMobile {...routeProps} />
          )}
        />
      </Switch>
    </Suspense>
  )
}
