import { connect } from 'react-redux'
// import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {
    example: 'example'
    //  currentUser: getMe(state, props)
  }
}

export const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)
