import React from 'react'
import { storiesOf } from '@storybook/react'
import RoundImageRow from './RoundImageRow'

storiesOf('RoundImageRow', module)
    .add('show', () => (
    <RoundImageRow 
        imageUrls={['https://www.pixelstalk.net/wp-content/uploads/2016/07/Download-Free-Sunrise-Wallpaper-620x349.jpg', 
        'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2017/11/autumn_fireball/17255671-1-eng-GB/Autumn_fireball.jpg',
        'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2017/11/autumn_fireball/17255671-1-eng-GB/Autumn_fireball.jpg',
        'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2017/11/autumn_fireball/17255671-1-eng-GB/Autumn_fireball.jpg']}
        
        />
    ),
    { notes: 'Create a round image row whit de array imageUrls. Just put de links of what images you like' }
)
