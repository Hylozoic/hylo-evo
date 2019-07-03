import React from 'react'
import { storiesOf } from '@storybook/react'
import ModalSidebar from './ModalSidebar'

storiesOf('ModalSidebar', module)
.add('Full', () => (
    <ModalSidebar 
        header='This is the header' 
        body='And this the body' 
        imageUrl='https://cdn.wallpapersafari.com/98/91/ma7o4Z.jpg' 
        secondParagraph='Second Paragraph'
        imageDialogOne='Image dialog one'
        imageDialogTwo='Image dialog two'
    />
    ),
    { notes: 'Simple "All Feeds" icon' }
)

.add('Header', () => (
    <ModalSidebar 
        header='This is the header'
    />
),

)

.add('Body', () => (
    <ModalSidebar 
        body='And this the body' 
    />
),

)

.add('Second Paragraph', () => (
    <ModalSidebar 
        secondParagraph='Finnaly, the second Paragraph' 
    />
),

)

.add('Image URL', () => (
    <ModalSidebar 
        imageUrl='https://cdn.wallpapersafari.com/98/91/ma7o4Z.jpg' 
    />
),

)

