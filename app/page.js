import Home from '@/components/home/Home'
import { getPosts } from '@/utils/getPosts';


const page = async () => {
  const posts = await getPosts();
  return (
      <Home posts={posts}/>
  )
}

export default page