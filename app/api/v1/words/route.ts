import { getWordsV1Handler, postWordHandler } from '@/lib/utils/apiHandlers'
import { withGetWrapper, withPostWrapper } from '@/lib/utils/apiWrapper'

// v1 API returns all matching words as a simple array (backward compatibility)
export const GET = withGetWrapper(getWordsV1Handler)

export const POST = withPostWrapper(postWordHandler)
