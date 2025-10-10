import { getRandomWordHandler } from '@/lib/utils/apiHandlers'
import { withGetWrapper } from '@/lib/utils/apiWrapper'

export const GET = withGetWrapper(getRandomWordHandler)
