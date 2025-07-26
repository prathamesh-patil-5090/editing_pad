import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileNode[]
  parentId?: string
  isOpen?: boolean
}

interface FileSystemState {
  files: FileNode[]
  openFiles: string[]
  activeFileId: string | null
  expandedFolders: string[]
}

const initialState: FileSystemState = {
  files: [
    {
      id: 'root',
      name: 'project',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: 'welcome',
          name: 'welcome.js',
          type: 'file',
          content: '// Welcome to Editing Pad!\nconsole.log("Hello, World!");',
          parentId: 'root'
        }
      ]
    }
  ],
  openFiles: ['welcome'],
  activeFileId: 'welcome',
  expandedFolders: ['root']
}

const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState,
  reducers: {
    createFile: (state, action: PayloadAction<{ name: string; parentId: string; content?: string }>) => {
      const { name, parentId, content = '' } = action.payload
      const id = `${parentId}-${name}-${Date.now()}`
      const newFile: FileNode = {
        id,
        name,
        type: 'file',
        content,
        parentId
      }
      
      const parent = findNodeById(state.files, parentId)
      if (parent && parent.type === 'folder') {
        if (!parent.children) parent.children = []
        parent.children.push(newFile)
      }
    },
    
    createFolder: (state, action: PayloadAction<{ name: string; parentId: string }>) => {
      const { name, parentId } = action.payload
      const id = `${parentId}-${name}-${Date.now()}`
      const newFolder: FileNode = {
        id,
        name,
        type: 'folder',
        children: [],
        parentId,
        isOpen: false
      }
      
      const parent = findNodeById(state.files, parentId)
      if (parent && parent.type === 'folder') {
        if (!parent.children) parent.children = []
        parent.children.push(newFolder)
      }
    },
    
    deleteFile: (state, action: PayloadAction<string>) => {
      const fileId = action.payload
      state.files = removeNodeById(state.files, fileId)
      state.openFiles = state.openFiles.filter(id => id !== fileId)
      if (state.activeFileId === fileId) {
        state.activeFileId = state.openFiles[0] || null
      }
    },
    
    renameFile: (state, action: PayloadAction<{ id: string; newName: string }>) => {
      const { id, newName } = action.payload
      const file = findNodeById(state.files, id)
      if (file) {
        file.name = newName
      }
    },
    
    updateFileContent: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const { id, content } = action.payload
      const file = findNodeById(state.files, id)
      if (file && file.type === 'file') {
        file.content = content
      }
    },
    
    openFile: (state, action: PayloadAction<string>) => {
      const fileId = action.payload
      if (!state.openFiles.includes(fileId)) {
        state.openFiles.push(fileId)
      }
      state.activeFileId = fileId
    },
    
    closeFile: (state, action: PayloadAction<string>) => {
      const fileId = action.payload
      state.openFiles = state.openFiles.filter(id => id !== fileId)
      if (state.activeFileId === fileId) {
        const index = state.openFiles.indexOf(fileId)
        state.activeFileId = state.openFiles[index - 1] || state.openFiles[0] || null
      }
    },
    
    setActiveFile: (state, action: PayloadAction<string>) => {
      state.activeFileId = action.payload
    },
    
    toggleFolder: (state, action: PayloadAction<string>) => {
      const folderId = action.payload
      const folder = findNodeById(state.files, folderId)
      if (folder && folder.type === 'folder') {
        folder.isOpen = !folder.isOpen
        if (folder.isOpen) {
          if (!state.expandedFolders.includes(folderId)) {
            state.expandedFolders.push(folderId)
          }
        } else {
          state.expandedFolders = state.expandedFolders.filter(id => id !== folderId)
        }
      }
    }
  }
})

// Helper functions
function findNodeById(nodes: FileNode[], id: string): FileNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

function removeNodeById(nodes: FileNode[], id: string): FileNode[] {
  return nodes.filter(node => {
    if (node.id === id) return false
    if (node.children) {
      node.children = removeNodeById(node.children, id)
    }
    return true
  })
}

export const {
  createFile,
  createFolder,
  deleteFile,
  renameFile,
  updateFileContent,
  openFile,
  closeFile,
  setActiveFile,
  toggleFolder
} = fileSystemSlice.actions

export default fileSystemSlice.reducer