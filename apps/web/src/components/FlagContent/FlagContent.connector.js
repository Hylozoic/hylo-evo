import { connect } from 'react-redux'
import { submitFlagContent } from './FlagContent.store'

const mapDispatchToProps = { submitFlagContent }

export default connect(null, mapDispatchToProps)
