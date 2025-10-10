import { getWordsV2Handler, postWordHandler } from '@/lib/utils/apiHandlers'
import { withGetWrapper, withPostWrapper } from '@/lib/utils/apiWrapper'

// v2 API returns paginated words with metadata
export const GET = withGetWrapper(getWordsV2Handler)

export const POST = withPostWrapper(postWordHandler)
