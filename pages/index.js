import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
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

const Home = () => {
  const router = useRouter();
  const [likes, setLikes] = useState({});
  const [favorites, setFavorites] = useState({});
  const [users, setUsers] = useState([]);
  
  const [showUsers, setShowUsers] = useState(false);
  //需要加载的图片:
  const images = ['1.jpg', '2.jpg', '4.jpg', '5.jpg'];
  
  const handleLike = () => {
      //TODO: 点赞事件
      const newLikes = {...likes};
      images.forEach((image, index) => {
        if (newLikes[index] === undefined) {
          newLikes[index] = 0;
        }
        if (image === `image-${index}`) {
          newLikes[index] += 1;
        }
      });
      setLikes(newLikes);
  }


  const handleFavorite = () => {
    //TODO: 收藏事件
  }

  const handleDownload = () => {
    //TODO: 下载事件
  }

  const handleReport = () => {
    //TODO: 举报事件
  }

//用户函数：
  const handleMyLike = () => {
    //TODO: 点赞事件
  router.push({
    pathname: '/mylikes',
    query: { token: router.query.token },
  });
  }

  const handleMyFavorite = () => {
    //TODO: 收藏事件
  }


  const fetcher = ([url, token]) =>
    fetch(url, {
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json', token }),
      credentials: 'same-origin',
    }).then((res) => res.json())

  const { data, error } = useSWR(
    ['/api/getUser', router.query.token],
    fetcher
  );
  
  useEffect(() => {
    if (router.query.token) {
      const fetcher = ([url, token]) =>
        fetch(url, {
          method: 'GET',
          headers: new Headers({ 'Content-Type': 'application/json', token }),
          credentials: 'same-origin',
        }).then((res) => res.json())

      if (data && !error) {
        console.log(data);
      } else {
        console.log(error);
      }
    }
  }, [router.query.token]);

  useEffect(() => {
    const session = supabase.auth.session();
    if (session) {
      setUser(session.user);
    }
  }, []);

  const [user, setUser] = useState(null);

  return (
    <div>
      {user ? (
        <div>
          <p>欢迎回来，{user.email}！</p>
          <button onClick={handleMyLike}>我的赞</button>
          <button onClick={handleMyFavorite}>我的收藏</button>

          <button onClick={() => {
            supabase.auth.signOut();
            router.push('/');
            //必须刷新页面才能看到真正的用户退出登录后的主页!!!!!!
            window.location.reload();//刷新页面code
          }}>退出登录</button>

        </div>
      ) : (
        <button onClick={() => router.push('/signin')}>
          用户登录
        </button>
      )}
      <h1>欢迎来到我的门户网站！</h1>
      <p>探索并享受我们提供的所有功能。</p>
        
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {images.map((image, index) => (
          <div key={index} style={{marginRight: '10px', marginBottom: '10px'}}>
            <img src={image} alt={`image-${index}`} style={{width: '200px', height: '200px'}}/>
            <div>
              <button onClick={handleLike}>赞</button>
              <button onClick={handleFavorite}>收藏</button>
              <button onClick={handleDownload}>下载</button>
              <button onClick={handleReport}>举报</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;
