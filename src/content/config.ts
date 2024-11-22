import { defineCollection, reference, z } from "astro:content";

const teamCollection = defineCollection({
    type: 'content',
    schema: ({image})=>z.object({
        type: z.enum(['mentor', 'member']),
        name: z.string(),
        photo: image(),
        class: z.string(),
        socials: z.array(z.object({
            type: z.enum(['facebook', 'instagram', 'github', 'website']),
            href: z.string(),
            label: z.string()
        })),
        portfolio: z.array(z.object({
            image: image(),
            title: z.string(),
            subtitle: z.string()
        })).optional()
    })
});

const blogCollection = defineCollection({
    type: 'content',
    schema: ({image})=>z.object({
        title: z.string(),
        cover: image(),
        author: reference('team'),
        date: z.date(),

    })
})

export const collections = {
    'team': teamCollection,
    'blog': blogCollection
}