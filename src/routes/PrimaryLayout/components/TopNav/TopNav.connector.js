import { connect } from 'react-redux'
import { logout } from 'routes/Login/Login.store'
import { toggleCommunitiesDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'
export default connect(null, {logout, toggleCommunitiesDrawer})
