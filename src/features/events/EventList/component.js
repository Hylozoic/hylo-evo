/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'

export default function EventList () {
  return <div>
    <Link to='/events'>Events</Link> | <Link to='/events/1'>Event 1</Link>
  </div>
}
