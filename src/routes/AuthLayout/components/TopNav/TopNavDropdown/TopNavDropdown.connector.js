import { connect } from 'react-redux'

export function mapStateToProps (state, props) {
  return {
    topNavPosition: state.TopNav
  }
}

export const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
