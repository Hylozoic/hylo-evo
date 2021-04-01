// import { groupUrl } from 'util/navigation'
import { DEFAULT_AVATAR } from 'store/models/Group'
import * as d3 from 'd3'

export function runForceGraph (
  container,
  linksData,
  nodesData
) {
  const links = linksData.map((d) => Object.assign({}, d))
  const nodes = nodesData.map((d) => Object.assign({}, d))

  const containerRect = container.getBoundingClientRect()
  const height = containerRect.height
  const width = containerRect.width

  const color = () => { return '#2A4059' }

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

  const simulation = d3
    .forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(function (d) { return d.value }))
    .force('charge', d3.forceManyBody().strength(-500))
    .force('collide', d3.forceCollide().radius(60).iterations(2))
    .force('x', d3.forceX())
    .force('y', d3.forceY())

  let svg = d3
    .select(container)
    .append('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .call(d3.zoom().on('zoom', function (event) {
      // TODO: More testing. Disabling zoom for now.
      // svg.attr('transform', event.transform)
    }))

  svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 13)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 5)
    .attr('markerHeight', 8)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999')
    .style('stroke', 'none')

  const link = svg
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('polyline')
    .data(links)
    .join('polyline')
    .attr('stroke-width', 3)
    .attr('marker-mid', 'url(#arrowhead)')

  const node = svg
    .append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 24)
    .attr('fill', color)
    .call(drag(simulation))

  const images = svg.append('g')
    .attr('class', 'img')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('image')
    .attr('xlink:href', d => d.avatarUrl ? d.avatarUrl : DEFAULT_AVATAR)
    .attr('x', d => -25)
    .attr('y', d => -25)
    .attr('height', 50)
    .attr('width', 50)
    .call(drag(simulation))

  images.on('click', function (d) {
    // TODO if a member, go to group page
  })

  const label = svg.append('g')
    .attr('class', 'labels')
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('y', d => 50)
    // .attr('class', d => `fa ${getClass(d)}`)
    .text(d => { return d.name })
    .style('font-size', d => d.index === 0 ? '20px' : '16px')
    .style('font-weight', 'bold')
    .call(drag(simulation))

  simulation.on('tick', () => {
    // update link positions
    link.attr('points', function (d) {
      return d.source.x + ',' + d.source.y + ' ' +
        (d.source.x + d.target.x) / 2 + ',' + (d.source.y + d.target.y) / 2 + ' ' +
        d.target.x + ',' + d.target.y
    })

    // update node positions
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)

    // update image positions
    images
      .attr('x', d => { return d.x - 25 })
      .attr('y', d => { return d.y - 25 })

    // update label positions
    label
      .attr('x', d => { return d.x })
      .attr('y', d => { return d.y + 50 })
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
