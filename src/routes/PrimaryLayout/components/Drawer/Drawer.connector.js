import { connect } from 'react-redux'
import { toggleDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'
import getMemberships from 'store/selectors/getMemberships'

export function mapStateToProps (state, props) {
  return {
    memberships: getMemberships(state)
  }
}

export const mapDispatchToProps = {
  toggleDrawer
}

export default connect(mapStateToProps, mapDispatchToProps)
