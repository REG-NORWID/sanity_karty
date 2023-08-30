// theme.ts
export default {
  name: 'theme',
  title: 'Tematy',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Temat',
      type: 'string',
      validation: (Rule: {required: () => any}) => Rule.required(),
    },
    {
      name: 'subtheme',
      title: 'Tematy dodatkowy',
      // type: 'reference',
      // to: [{type: 'subtheme'}],
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'subtheme'}],
          options: {
            filter: async ({document, getClient}: any) => {
              const emptyArr = [''] // empty array
              let themeId = '' //id
              const isDrafts = document._id.includes('drafts')
              if (isDrafts) {
                themeId = document._id.split('.')[1]
              } else {
                themeId = document._id
              } // set id in order of document condition

              const client = getClient({apiVersion: '2021-10-21'})
              const data = await client.fetch(
                '*[_type == "subtheme"]{_id,title,theme->{title,_id,_ref}}'
              ) // fetch all subtheme from Content lake

              const filter = data.filter((item: any) => item.theme._id === themeId) // find all subtheme owned by actual theme

              if (filter.length > 0) {
                const myMap = filter.map((item: any) => item._id)
                // set array of subtheme id
                return {
                  filter: '_id in $arr[]',
                  params: {arr: myMap},
                }
              } // filter is full

              return {
                filter: '_id in $arr[]',
                params: {arr: emptyArr},
              } // filter is empty
            },
          },
        },
      ],

      validation: (Rule: {unique: () => any}) => Rule.unique(),
    },
  ],
}
