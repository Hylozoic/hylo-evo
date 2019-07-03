import React from 'react'
import { storiesOf } from '@storybook/react'
import RoundImage from './RoundImage'

storiesOf('RoundImage', module)
.add('show', () => (
<RoundImage url='https://www.pixelstalk.net/wp-content/uploads/2016/09/Black-Horse-Wallpapers-For-Laptops-620x388.jpg'/>
),
{ notes: 'You can use the effect of round image just using whit the string "url". Additionally you can apply additional size effects with the bool "small", "medium", "large" and "overlaps"' }
)

.add('small', () => (
    <RoundImage small={true} url='https://www.pixelstalk.net/wp-content/uploads/2016/09/Black-Horse-Wallpapers-For-Laptops-620x388.jpg'/>
    ),

)
.add('medium', () => (
    <RoundImage medium={true} url='https://www.pixelstalk.net/wp-content/uploads/2016/09/Black-Horse-Wallpapers-For-Laptops-620x388.jpg'/>
    ),
)
.add('large', () => (
    <RoundImage large={true} url='https://www.pixelstalk.net/wp-content/uploads/2016/09/Black-Horse-Wallpapers-For-Laptops-620x388.jpg'/>
    ),
)
.add('overlaps', () => (
    <RoundImage overlaps={true} url='https://www.pixelstalk.net/wp-content/uploads/2016/09/Black-Horse-Wallpapers-For-Laptops-620x388.jpg'/>
    ),
)


