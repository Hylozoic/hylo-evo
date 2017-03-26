import CSSModules from 'react-css-modules'
import component from './component'
import connector from './connector'
import styles from './component.scss'

export const styledComponent = CSSModules(component, styles, {allowMultiple: true})

export default connector(styledComponent)
