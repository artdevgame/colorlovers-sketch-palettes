async function proxy (url) {
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3000/${url}`
  }
  return url
}

export default proxy