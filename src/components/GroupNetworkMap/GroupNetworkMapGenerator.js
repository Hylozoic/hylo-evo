// import React from 'react'
// import { groupUrl } from 'util/navigation'
import { DEFAULT_AVATAR } from 'store/models/Group'
// import { Link } from 'react-router-dom'
// import RoundImage from 'components/RoundImage'
import * as d3 from 'd3'
import styles from './GroupNetworkMap.scss'

export function runForceGraph (
  container,
  linksData,
  nodesData,
  nodeHoverTooltip
) {
  const links = linksData.map((d) => Object.assign({}, d))
  const nodes = nodesData.map((d) => Object.assign({}, d))

  const containerRect = container.getBoundingClientRect()
  const height = containerRect.height
  const width = containerRect.width
  console.log('\ncontainer size\n', height, width)

  const color = () => { return '#2A4059' }

  const icon = (d) => {
    // <Link to={groupUrl(d.slug)}>
    //   <RoundImage url={d.avatarUrl || DEFAULT_AVATAR} small /> {d.name}
    // </Link>
    console.log('d inside ICON', d)
    return d.name
  }

  const getClass = (d) => {
    return d.gender === 'male' ? styles.male : styles.female
  }

  const drag = (simulation) => {
    const dragstarted = (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    const dragged = (event, d) => {
      d.fx = event.x
      d.fy = event.y
    }

    const dragended = (event, d) => {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  }

  // Add the tooltip element to the graph
  const tooltip = document.querySelector('#graph-tooltip')
  if (!tooltip) {
    const tooltipDiv = document.createElement('div')
    tooltipDiv.classList.add(styles.tooltip)
    tooltipDiv.style.opacity = '0'
    tooltipDiv.id = 'graph-tooltip'
    document.body.appendChild(tooltipDiv)
  }
  const div = d3.select('#graph-tooltip')

  const addTooltip = (hoverTooltip, d, x, y) => {
    div
      .transition()
      .duration(200)
      .style('opacity', 0.9)
    div
      .html(hoverTooltip(d))
      .style('left', `${x}px`)
      .style('top', `${y - 28}px`)
  }

  const removeTooltip = () => {
    div
      .transition()
      .duration(200)
      .style('opacity', 0)
  }

  const simulation = d3
    .forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id))
    .force('charge', d3.forceManyBody().strength(-150))
    .force('x', d3.forceX())
    .force('y', d3.forceY())

  const svg = d3
    .select(container)
    .append('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .call(d3.zoom().on('zoom', function (event) {
      svg.attr('transform', event.transform)
    }))

  const link = svg
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', d => Math.sqrt(d.value))

  var node = svg
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 15)
    .attr('fill', color)
    .call(drag(simulation))

  node.append('image')
    .attr('xlink:href', DEFAULT_AVATAR)
    .attr('x', -8)
    .attr('y', -8)
    .attr('width', 20)
    .attr('height', 20)

  const label = svg.append('g')
    .attr('class', 'labels')
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'hanging')
    .attr('class', d => `fa ${getClass(d)}`)
    .text(d => { return d.name })
    .call(drag(simulation))

  label.on('mouseover', (event, d) => {
    addTooltip(nodeHoverTooltip, d, event.pageX, event.pageY)
  })
    .on('mouseout', () => {
      removeTooltip()
    })

  simulation.on('tick', () => {
    // update link positions
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    // update node positions
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)

    // update label positions
    label
      .attr('x', d => { return d.x })
      .attr('y', d => { return d.y })
  })

  return {
    destroy: () => {
      simulation.stop()
    },
    nodes: () => {
      return svg.node()
    }
  }
}
