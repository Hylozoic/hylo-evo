import { connect } from 'react-redux'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { toggleDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'

export const getMemberships = ormCreateSelector(
  orm,
  state => state.orm,
  session => {
    return session.Membership.all().toModelArray()
  }
)

export function mapStateToProps (state, props) {
  return {
    memberships: getMemberships(state)
  }
}

export const mapDispatchToProps = {
  toggleDrawer
}

export default connect(mapStateToProps, mapDispatchToProps)
