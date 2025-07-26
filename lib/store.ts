import { configureStore } from '@reduxjs/toolkit'
import fileSystemReducer from './features/fileSystemSlice'
import editorReducer from './features/editorSlice'
import { saveState, debounce } from './persistence'

export const store = configureStore({
  reducer: {
    fileSystem: fileSystemReducer,
    editor: editorReducer,
  }
})

// Save state to localStorage on changes (debounced)
const debouncedSave = debounce(saveState, 1000)
store.subscribe(() => {
  debouncedSave(store.getState())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch