//subtheme.ts
export default {
  name: 'subtheme',
  title: 'Tematy dodatkowe',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Temat dodatkowy',
      type: 'string',
      validation: (Rule: {required: () => any}) => Rule.required(),
    },
    {
      name: 'theme',
      title: 'Temat główny',
      type: 'reference',
      to: [{type: 'theme'}],
      validation: (Rule: {required: () => any}) => Rule.required(),
    },
  ],
}
