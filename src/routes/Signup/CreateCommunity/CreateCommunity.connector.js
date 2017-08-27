import { connect } from 'react-redux'
import { createCommunity } from './CreateCommunity.store'

export const mapDispatchToProps = {createCommunity}

export default connect(null, mapDispatchToProps)
