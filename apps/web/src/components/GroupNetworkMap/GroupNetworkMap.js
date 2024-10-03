import React from 'react'
import { runForceGraph } from './GroupNetworkMapGenerator'
import styles from './GroupNetworkMap.module.scss'

export default ({ networkData }) => {
  const linksData = networkData.links
  const nodesData = networkData.nodes

  if (linksData.length && nodesData.length) {
    const containerRef = React.useRef(null)

    React.useEffect(() => {
      let destroyFn

      if (containerRef.current) {
        const { destroy } = runForceGraph(containerRef.current, linksData, nodesData)
        destroyFn = destroy
      }

      return destroyFn
    }, [])

    return <div ref={containerRef} className={styles.container} />
  }

  return <div />
}
