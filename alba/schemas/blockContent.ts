// studio/schemas/blockContent.ts
import {defineType, defineArrayMember} from 'sanity'

export default defineType({
    name: 'blockContent',
    title: 'Block Content',
    type: 'array',
    of: [
        defineArrayMember({
            title: 'Block',
            type: 'block',
            styles: [{title: 'Normal', value: 'normal'}],
            lists: [{title: 'Bullet', value: 'bullet'}],
        }),
        defineArrayMember({
            type: 'image',
            options: {hotspot: true},
        }),
    ],
})