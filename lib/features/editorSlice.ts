import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface EditorState {
  theme: 'vs-dark' | 'vs-light'
  fontSize: number
  wordWrap: 'on' | 'off'
  minimap: boolean
  lineNumbers: 'on' | 'off' | 'relative'
  tabSize: number
}

const initialState: EditorState = {
  theme: 'vs-dark',
  fontSize: 14,
  wordWrap: 'off',
  minimap: true,
  lineNumbers: 'on',
  tabSize: 2
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'vs-dark' | 'vs-light'>) => {
      state.theme = action.payload
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload
    },
    setWordWrap: (state, action: PayloadAction<'on' | 'off'>) => {
      state.wordWrap = action.payload
    },
    toggleMinimap: (state) => {
      state.minimap = !state.minimap
    },
    setLineNumbers: (state, action: PayloadAction<'on' | 'off' | 'relative'>) => {
      state.lineNumbers = action.payload
    },
    setTabSize: (state, action: PayloadAction<number>) => {
      state.tabSize = action.payload
    }
  }
})

export const {
  setTheme,
  setFontSize,
  setWordWrap,
  toggleMinimap,
  setLineNumbers,
  setTabSize
} = editorSlice.actions

export default editorSlice.reducer