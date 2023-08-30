// year.ts
export default {
  name: 'year',
  title: 'Roczniki',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Rok',
      type: 'string',
      validation: (Rule: {required: () => any}) => Rule.required(),
    },
  ],
}
