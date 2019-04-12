import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { personUrl } from 'util/navigation'

export function mapStateToProps (state, props) {
  return { }
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    goToPerson: (id, slug) => () => {
      const url = props.subject === 'network'
        ? personUrl(id, null, slug)
        : personUrl(id, slug)
      return dispatch(push(url))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
