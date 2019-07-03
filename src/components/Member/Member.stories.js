import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import Member from './Member'

storiesOf('Member', module)
  .addDecorator(story => (
    <MemoryRouter>
                <>
                  <br />
                  {story()}
                </>
    </MemoryRouter>
  ))
  .add('show', () => (
    <Member
      member={{
        id: 'one',
        name: 'Batman',
        location: 'Gotham'
      }}
      goToPerson={(id, slug) => {}}
    />
  ),
  {notes: 'A menber profile view with the avatar, skills, tagline and option'}
  )
  .add('Avatar', () => (
    <Member
      member={{
        id: 'one',
        name: 'Batman',
        location: 'Gotham',
        avatarUrl: 'http://www.xat.com/web_gear/chat/av/41.png'
      }}
      goToPerson={(id, slug) => {}}
    />
  ))
  .add('skills', () => (
    <Member
      member={{
        id: 'one',
        name: 'Batman',
        location: 'Gotham',
        skills: [ { name: 'strong' }, { name: 'dark' } ]
      }}
      goToPerson={(id, slug) => {}}
    />
  ))
  .add('tagline', () => (
    <Member
      member={{
        id: 'one',
        name: 'Batman',
        location: 'Gotham',
        tagline: 'Sometimes the truth is not good enough, sometimes people deserve more. Sometimes people deserve their faith to be rewarded.'
      }}
      goToPerson={(id, slug) => {}}
    />
  ))
  .add('with option', () => (
    <Member
      member={{
        id: 'one',
        name: 'Batman',
        location: 'Gotham'
      }}
      goToPerson={(id, slug) => {}}
      canModerate={{}}
    />
  ))
  .add('full', () => (
    <Member
      member={{
        id: 'one',
        name: 'Batman',
        location: 'Gotham',
        tagline: 'Sometimes the truth is not good enough, sometimes people deserve more. Sometimes people deserve their faith to be rewarded.',
        avatarUrl: 'http://www.xat.com/web_gear/chat/av/41.png',
        skills: [ { name: 'strong' }, { name: 'dark' } ]
      }}
      goToPerson={(id, slug) => {}}
      canModerate={{}}
      removeMember={(id) => {}}
      className=''
      slug='hola'
    />
  ))
