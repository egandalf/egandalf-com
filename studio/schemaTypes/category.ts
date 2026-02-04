import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{type: 'category'}],
      options: {
        filter: ({document}) => ({
          filter: '_id != $id',
          params: {id: document._id},
        }),
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      parentName: 'parent.name',
    },
    prepare({title, parentName}) {
      return {
        title: title,
        subtitle: parentName ? `Parent: ${parentName}` : 'Top-level category',
      }
    },
  },
})
