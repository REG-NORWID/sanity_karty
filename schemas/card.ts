// card.ts
export default {
  name: 'card',
  title: 'Karty',
  type: 'document',
  fields: [
    {
      name: 'number',
      title: 'Numer',
      type: 'string',
      validation: [
        (Rule: {required: () => any}) =>
          Rule.required()
            .min(6)
            .max(6)
            .custom(async (number: string, {document, getClient}: any) => {
              const client = getClient({apiVersion: '2021-10-21'})
              const data: any[] = await client.fetch('*[_type == "card"]{_id,number,title}')
              if (data.length === 0) {
                return true
              } else {
                const dataWithoutDraft = data.filter((item: {_id: string}) => {
                  const isIncludes = item._id.includes('drafts')
                  return !isIncludes
                })
                const isInArray = dataWithoutDraft.find((item: {_id: string; number: string}) => {
                  let cardId = ''
                  const isDrafts = document._id.includes('drafts')
                  if (isDrafts) {
                    cardId = document._id.split('.')[1]
                  } else {
                    cardId = document._id
                  }
                  if (item.number === number && item._id !== cardId) {
                    return true
                  } else {
                    return false
                  }
                })
                if (isInArray) {
                  const errorMessage = `Ten numer już istnieje.`
                  return errorMessage
                }
                return true
              }
            }),
      ],
    },
    {
      name: 'title',
      title: 'Tytuł*',
      type: 'string',
      validation: (Rule: {required: () => any}) => Rule.required(),
    },
    {
      name: 'image_slug',
      title: 'Link do Zdjęcia*',
      type: 'string',
      validation: (Rule: {required: () => any}) => Rule.required(),
    },
    {
      name: 'theme',
      title: 'Temat*',
      type: 'reference',
      to: [{type: 'theme'}],
      validation: (Rule: {required: () => any}) => Rule.required(),
    },
    {
      name: 'subtheme',
      title: 'Temat dodatkowy',
      type: 'reference',
      to: [{type: 'subtheme'}],
      options: {
        filter: async ({document, getClient}: any) => {
          const emptyArr = ['']
          const client = getClient({apiVersion: '2021-10-21'})
          const ref = document.theme._ref
          const data = await client.fetch('*[_type == "theme"]{_id,subtheme[]->{title}}')
          const find = data.find((item: any) => item._id === ref)

          if (find.subtheme) {
            const myMap = find.subtheme.map((item: any) => item.title)
            return {
              filter: 'title in $arr[]',
              params: {arr: myMap},
            }
          }

          return {
            filter: 'title in $arr[]',
            params: {arr: emptyArr},
          }
        },
      },
    },
    {
      name: 'years',
      title: 'Roczniki*',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'year'}]}],
      validation: (Rule: {required: () => any}) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Link do Źródła',
      type: 'string',
    },
    {
      name: 'warning',
      title: 'Uwaga',
      type: 'text',
    },
  ],
}
