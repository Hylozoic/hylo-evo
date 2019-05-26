import React from 'react'
import { storiesOf } from '@storybook/react'
import Icon from 'components/Icon'
import '../../css/global/index.scss'

const props = {
  onClick: () => {}
}

const notes = `
hylo evo icons. Possible values are: EmailNotification, InAppNotification, PushNotification, Announcement, Invite, Post, Star, Plus, Settings, ArrowForward, Document, Download, Send, Checkmark, Empty, Back, AddImage, Clock, StarCircle, ProfileUrl, ProfileTwitter, ProfileLinkedin, ProfileFacebook, Reply, LinkedIn, Google, Facebook, Ex, NewCommunity, Projects, Events, Home, Topics, Members, Messages, Notifications, Search, Share, More, ArrowUp, ArrowDown, Location, Trash, Pin, Complete, Flag, Circle, Paperclip, Edit
`

storiesOf('Icon', module)
//   .addDecorator(story => (
//     story()
//   ))
  .add('Normal', () =>
    <Icon {...props} name='EmailNotification' />,
  {
    notes
  }
  )
  .add('Labeled', () =>
    <Icon {...props} name='EmailNotification'> Sample text</Icon>,
  {
    notes
  }
  )
  .add('Green', () =>
    <Icon {...props} green='true' name='EmailNotification'> Sample text</Icon>,
  {
    notes
  }
  )
