import React from 'react'
import { runForceGraph } from './GroupNetworkMapGenerator'
import styles from './GroupNetworkMap.scss'

export default ({ linksData, nodesData }) => {
  const containerRef = React.useRef(null)

  const nodeHoverTooltip = React.useCallback((node) => {
    return `<div>${node.name}</div>`
  }, [])

  React.useEffect(() => {
    let destroyFn

    if (containerRef.current) {
      const { destroy } = runForceGraph(containerRef.current, linksData, nodesData, nodeHoverTooltip)
      destroyFn = destroy
    }

    return destroyFn
  }, [])

  return <div ref={containerRef} className={styles.container} />
}
