import HomePage from '@/components/HomePage'
import { getCategories, getConfig } from '@/lib/utils/serverFetch'

/**
 * Home page - Server Component that fetches static data
 * and passes it to the client HomePage component
 */
const Home = async () => {
  // Fetch data in parallel on the server
  const [categories, config] = await Promise.all([
    getCategories().catch(() => []), // Fallback to empty array on error
    getConfig().catch(() => ({ destructiveEndpointsEnabled: false })), // Fallback on error
  ])

  return <HomePage initialCategories={categories} initialConfig={config} />
}

export default Home
