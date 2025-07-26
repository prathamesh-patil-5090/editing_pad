'use client'

import { useCallback } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { updateFileContent } from '@/lib/features/fileSystemSlice'

interface EditorProps {
  className?: string
}

export default function Editor({ className = '' }: EditorProps) {
  const dispatch = useAppDispatch()
  const { files, activeFileId } = useAppSelector(state => state.fileSystem)
  const editorConfig = useAppSelector(state => state.editor)

  // Find active file
  const findFileById = (nodes: any[], id: string): any => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findFileById(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  const activeFile = activeFileId ? findFileById(files, activeFileId) : null

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (activeFileId && value !== undefined) {
      dispatch(updateFileContent({ id: activeFileId, content: value }))
    }
  }, [activeFileId, dispatch])

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'js': return 'javascript'
      case 'ts': return 'typescript'
      case 'tsx': return 'typescript'
      case 'jsx': return 'javascript'
      case 'html': return 'html'
      case 'css': return 'css'
      case 'json': return 'json'
      case 'md': return 'markdown'
      case 'py': return 'python'
      case 'java': return 'java'
      case 'cpp': case 'c': return 'cpp'
      case 'rs': return 'rust'
      case 'go': return 'go'
      default: return 'plaintext'
    }
  }

  if (!activeFile) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 text-gray-400 ${className}`}>
        <div className="text-center">
          <h2 className="text-xl mb-2">Welcome to Editing Pad</h2>
          <p>Select a file from the explorer to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-900 ${className}`}>
      <MonacoEditor
        height="100%"
        language={getLanguageFromFileName(activeFile.name)}
        value={activeFile.content || ''}
        theme={editorConfig.theme}
        onChange={handleEditorChange}
        options={{
          fontSize: editorConfig.fontSize,
          wordWrap: editorConfig.wordWrap,
          minimap: { enabled: editorConfig.minimap },
          lineNumbers: editorConfig.lineNumbers,
          tabSize: editorConfig.tabSize,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderWhitespace: 'selection',
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          glyphMargin: true,
          folding: true,
          showFoldingControls: 'always',
          wordBasedSuggestions: 'off',
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          wordBasedSuggestionsOnlySameLanguage: true
        }}
        loading={
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading editor...
          </div>
        }
      />
    </div>
  )
}