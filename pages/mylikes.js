import { useState, useEffect } from 'react'
import { supabase } from '../lib/initSupabase'

export default function MyLikes({ token }) {
  const [likes, setLikes] = useState([])

  useEffect(() => {
    fetchLikes()
  }, [])

  async function fetchLikes() {
      if (!token?.user?.email) {
          console.log('token.user.email 未定义')
          return
        }
        
        const { data: likes, error } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', token.user.id)
        
        if (error) {
          console.log('获取 likes 数据时出错', error)
        } else {
          setLikes(likes)
        }
    }

  return (
    <div>
      <h1>My Likes</h1>
      {token?.user?.email && likes.length === 0 ? <p>{`${token.user.email}，你还没有点赞任何作品，快去赞吧！`}</p> : 
      <ul>
        {likes.map((like, index) => (
          <li key={index}>{like.post_id}</li>
        ))}
      </ul>}
    </div>
  )
}
