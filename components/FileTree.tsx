'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { FileNode, toggleFolder, openFile, createFile, createFolder, deleteFile } from '@/lib/features/fileSystemSlice'

interface FileTreeProps {
  className?: string
}

export default function FileTree({ className = '' }: FileTreeProps) {
  const dispatch = useAppDispatch()
  const { files, activeFileId, expandedFolders } = useAppSelector(state => state.fileSystem)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null)

  const handleNodeClick = (node: FileNode) => {
    if (node.type === 'file') {
      dispatch(openFile(node.id))
    } else {
      dispatch(toggleFolder(node.id))
    }
  }

  const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId })
  }

  const handleCreateFile = (parentId: string) => {
    const name = prompt('Enter file name:')
    if (name) {
      dispatch(createFile({ name, parentId }))
    }
    setContextMenu(null)
  }

  const handleCreateFolder = (parentId: string) => {
    const name = prompt('Enter folder name:')
    if (name) {
      dispatch(createFolder({ name, parentId }))
    }
    setContextMenu(null)
  }

  const handleDelete = (nodeId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteFile(nodeId))
    }
    setContextMenu(null)
  }

  const renderNode = (node: FileNode, depth = 0) => {
    const isExpanded = expandedFolders.includes(node.id)
    const isActive = activeFileId === node.id

    return (
      <div key={node.id}>
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-700 ${
            isActive ? 'bg-blue-600' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => handleNodeClick(node)}
          onContextMenu={(e) => handleContextMenu(e, node.id)}
        >
          {node.type === 'folder' && (
            <span className="mr-1">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
          <span className="mr-2">
            {node.type === 'folder' ? (
              isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />
            ) : (
              <File size={16} />
            )}
          </span>
          <span className="text-sm">{node.name}</span>
        </div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map((child: FileNode) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-gray-800 text-white overflow-auto ${className}`}>
      <div className="p-2 border-b border-gray-700">
        <h3 className="text-sm font-semibold">Explorer</h3>
      </div>
      <div className="p-1">
        {files.map((node: FileNode) => renderNode(node))}
      </div>
      
      {contextMenu && (
        <div
          className="fixed bg-gray-700 border border-gray-600 rounded shadow-lg z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-600 flex items-center"
            onClick={() => handleCreateFile(contextMenu.nodeId)}
          >
            <Plus size={14} className="mr-2" />
            New File
          </button>
          <button
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-600 flex items-center"
            onClick={() => handleCreateFolder(contextMenu.nodeId)}
          >
            <Plus size={14} className="mr-2" />
            New Folder
          </button>
          <button
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-600 flex items-center text-red-400"
            onClick={() => handleDelete(contextMenu.nodeId)}
          >
            <Trash2 size={14} className="mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}