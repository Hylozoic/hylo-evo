import React from 'react'
import GroupAboutVideoEmbed from 'components/GroupAboutVideoEmbed'
import ClickCatcher from 'components/ClickCatcher'
import HyloHTML from 'components/HyloHTML'
import './RichText.scss'

export default function RichTextWidget ({ group, settings }) {
  return (
    <div styleName='rich-text'>
      <GroupAboutVideoEmbed uri={settings.embeddedVideoURI} />
      <h2>{settings.title || `Welcome to ${group.name}!`}</h2>
      {settings.richText && (
        <ClickCatcher groupSlug='all'>
          <HyloHTML element='span' html={settings.richText} />
        </ClickCatcher>
      )}
      {settings.text && (
        <p>{settings.text}</p>
      )}
      {!settings.text && !settings.richText && (
        <p>
          We're happy you're here! Please take a moment to explore this page to see what's alive in our group. Introduce yourself by clicking Create to post a Discussion sharing who you are and what brings you to our group. And don't forget to fill out your profile - so likeminded new friends can connect with you!
        </p>
      )}
    </div>
  )
}
