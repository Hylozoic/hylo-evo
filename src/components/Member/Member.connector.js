import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { personUrl, networkUrl } from 'util/index'

export function mapStateToProps (state, props) {
  return { }
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    goToPerson: (id, slug) => () => {
      const url = props.subject === 'network'
        ? networkUrl(slug) + personUrl(id)
        : personUrl(id, slug)
      return dispatch(push(url))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
