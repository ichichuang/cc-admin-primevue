import { useLayoutStoreWithOut } from '@/stores'

export const useLoading = () => {
  const loadingStart = () => {
    const layoutStore = useLayoutStoreWithOut()
    layoutStore.setIsLoading(true)
  }

  const loadingDone = () => {
    const layoutStore = useLayoutStoreWithOut()
    layoutStore.setIsLoading(false)
  }

  const pageLoadingStart = () => {
    const layoutStore = useLayoutStoreWithOut()
    layoutStore.setIsPageLoading(true)
  }

  const pageLoadingDone = () => {
    const layoutStore = useLayoutStoreWithOut()
    layoutStore.setIsPageLoading(false)
  }

  return {
    loadingStart,
    loadingDone,
    pageLoadingStart,
    pageLoadingDone,
  }
}
