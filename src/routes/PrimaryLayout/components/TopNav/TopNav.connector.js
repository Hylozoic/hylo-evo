import { connect } from 'react-redux'
import { logout } from 'routes/NonAuthLayout/Login/Login.store'
import { toggleDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'
export default connect(null, {logout, toggleDrawer})
