export default async function Page(req) {
    const token = req.cookies.get('authToken'); 
    const data = await fetch('https://api.vercel.app/blog')
    const posts = await data.json()
    return (
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{token}{post.title}</li>
        ))}
      </ul>
    )
  }