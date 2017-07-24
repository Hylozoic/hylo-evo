import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { personUrl } from 'util/index'

export function mapStateToProps (state, props) {
  return { }
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    goToPerson: (id, slug) => () => dispatch(push(personUrl(id, slug)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
