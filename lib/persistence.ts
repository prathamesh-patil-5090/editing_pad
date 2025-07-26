const STORAGE_KEY = 'editing-pad-state'

export const loadState = (): any => {
  try {
    if (typeof window === 'undefined') return undefined
    
    const serializedState = localStorage.getItem(STORAGE_KEY)
    if (serializedState === null) return undefined
    
    return JSON.parse(serializedState)
  } catch (err) {
    console.warn('Failed to load state from localStorage:', err)
    return undefined
  }
}

export const saveState = (state: any) => {
  try {
    if (typeof window === 'undefined') return
    
    const serializedState = JSON.stringify({
      fileSystem: state.fileSystem,
      editor: state.editor
    })
    localStorage.setItem(STORAGE_KEY, serializedState)
  } catch (err) {
    console.warn('Failed to save state to localStorage:', err)
  }
}

// Debounce function to avoid excessive saves
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}