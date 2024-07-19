import { connect } from 'react-redux'

export function mapStateToProps (state, props) {
  let isPublic = props.isPublic
  let groupsPlusPublic = props.groups

  if (isPublic) {
    groupsPlusPublic.unshift({ name: 'Public', id: 'public', avatarUrl: '/public-icon.svg', slug: 'public' })
  }

  return {
    groups: groupsPlusPublic
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)
