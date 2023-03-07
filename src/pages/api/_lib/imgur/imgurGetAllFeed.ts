import { NextApiRequest, NextApiResponse } from 'next'
import { fauna } from '../../../../services/fauna'
import { query as q } from 'faunadb'

interface responseProps {
  data: any
}

interface userProps {
  ref: any
  data: {
    user: string
    banner: string
    avatar: string
  }
}

export default async function imgurGetAllFeed(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    let data
    await fauna
      .query(
        q.Map(
          q.Paginate(q.Documents(q.Collection('collections'))),
          q.Lambda('X', q.Get(q.Var('X'))),
        ),
      )
      .then(async (response: responseProps) => {
        data = await Promise.all(
          response.data.map(async (collection) => {
            if (collection.data.visible === false) {
              return
            }
            const user: userProps = await fauna.query(
              q.Get(collection.data.userId),
            )
            return {
              user: {
                ref: user.ref.id,
                user: user.data.user,
                avatar: user.data.avatar,
                banner: user.data.banner,
              },
              posts: Object.values(collection.data.posts).map(
                (value: object) => {
                  return {
                    ...value,
                    reference: user.ref.id,
                    user: user.data.user,
                    avatar: user.data.avatar,
                    banner: user.data.banner,
                  }
                },
              ),
            }
          }),
        )
        res.json(data)
      })
      .catch((e) => console.log(e))
  } else {
    res.status(405).end('Allow GET')
  }
}