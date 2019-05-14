import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { setLogin } from '../Login/Login.store'
import HolochainCurrentUserQuery from 'graphql/queries/HolochainCurrentUserQuery.graphql'
import { isNull } from 'lodash'

export function mapStateToProps (state) {
  return {
    hasCheckedLogin: !isNull(state.login.isLoggedIn)
  }
}

const mapDispatchToProps = { setLogin }

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { currentUser } = ownProps
  const { setLogin } = dispatchProps

  const checkLogin = currentUser
    ? () => setLogin(currentUser.isRegistered)
    : () => {}

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    checkLogin
  }
}

const currentUser = graphql(HolochainCurrentUserQuery, {
  skip: props => !!props.currentUser,
  props: ({ data: { me } }) => {
    return {
      currentUser: me
    }
  }
})

export default compose(
  currentUser,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)
