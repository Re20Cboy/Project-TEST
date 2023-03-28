import Link from 'next/link'
import { useRouter } from 'next/router'

import { useEffect, useState } from 'react';
import { supabase } from '../lib/initSupabase';

export async function getServerSideProps({ query }) {
  const { auth } = query
  if (auth) {
    const { error } = await supabase.auth.recoverSession(auth)
    if (error) return { props: {} }
    const { data: user, error: userError } = await supabase.auth.api.getUser(auth)
    if (userError) return { props: {} }
    return { props: { user } }
  }
  return { props: {} }
}






function Home() {
  const router = useRouter();
  const [likes, setLikes] = useState({});
  const [favorites, setFavorites] = useState({});
  
  const [users, setUsers] = useState([]);
  const imgSrc = "/img/testimg1.jpg";

const Index = ({ user }) => {
  return (
    <div>
      {user ? (
        <div>
          <p>Logged in as: {user.email}</p>
        </div>
      ) : (
        <div>
          <p>Not logged in</p>
        </div>
      )}
    </div>
  )
}
  
  const handleLike = (id) => {
    setLikes((prevLikes) => ({ ...prevLikes, [id]: (prevLikes[id] || 0) + 1 }));
  };

  const handleFavorite = (id) => {
    setFavorites((prevFavorites) => ({ ...prevFavorites, [id]: !prevFavorites[id] }));
  };
//
  const [showUsers, setShowUsers] = useState(false);

  return (
    <div>
      <button onClick={() => router.push('/signin')}>
        用户登录
      </button>
      
      <h1>欢迎来到我的门户网站！</h1>
      <p>探索并享受我们提供的所有功能。</p>

      <div>
        <img src={imgSrc} alt="testimg1" />
        <div>
          <button onClick={() => handleLike(1)}>赞 {likes[1] || 0}</button>
          <button onClick={() => handleFavorite(1)}>
            {favorites[1] ? "取消收藏" : "收藏"}
          </button>
          <button>
            <a href={imgSrc} download>下载</a>
          </button>
        </div>
      </div>
      <button onClick={() => setShowUsers(!showUsers)}>查看用户</button>
      {showUsers && (
        <div>
          <h2>已注册用户：</h2>
          {users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={user.username}>{user.username}</li>
              ))}
            </ul>
          ) : (
            <p>无任何已注册用户！</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;