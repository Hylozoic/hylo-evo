import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { personUrl } from 'util/navigation'

export function mapStateToProps (state, props) {
  return { }
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    goToPerson: (id, slug) => () => dispatch(push(personUrl(id, slug)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
