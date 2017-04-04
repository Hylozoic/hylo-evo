import { connect } from 'react-redux'
// import { someAction } from 'some/path/to/actions'

export function mapStateToProps (state, props) {
  return {
    exampleProp: 'example'
  }
}

export const mapDispatchToProps = {
  // someAction
}

export default connect(mapStateToProps, mapDispatchToProps)
