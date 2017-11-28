import React from 'react'
import { Link } from 'react-router-dom'

export default function TopicSupportComingSoon () {
  return <div>
    <h1>Were working on expanding</h1>
    <h2>#topics to more places</h2>
    <p>In the meantime, click a topic from an individual community</p>
    <p>to see posts from that community</p>
    <Link to='/reset-password'>
      <p>Forgot password?</p>
    </Link>
  </div>
}
