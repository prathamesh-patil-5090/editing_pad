'use client'

import { X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closeFile, setActiveFile } from '@/lib/features/fileSystemSlice'

interface FileTabsProps {
  className?: string
}

export default function FileTabs({ className = '' }: FileTabsProps) {
  const dispatch = useAppDispatch()
  const { files, openFiles, activeFileId } = useAppSelector(state => state.fileSystem)

  // Find file by ID helper
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

  const handleTabClick = (fileId: string) => {
    dispatch(setActiveFile(fileId))
  }

  const handleCloseTab = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation()
    dispatch(closeFile(fileId))
  }

  if (openFiles.length === 0) {
    return null
  }

  return (
    <div className={`bg-gray-800 border-b border-gray-700 flex overflow-x-auto ${className}`}>
      {openFiles.map((fileId: string) => {
        const file = findFileById(files, fileId)
        if (!file) return null

        const isActive = activeFileId === fileId

        return (
          <div
            key={fileId}
            className={`flex items-center px-3 py-2 border-r border-gray-700 cursor-pointer min-w-0 ${
              isActive 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => handleTabClick(fileId)}
          >
            <span className="text-sm truncate mr-2">{file.name}</span>
            <button
              className="hover:bg-gray-600 rounded p-1"
              onClick={(e) => handleCloseTab(e, fileId)}
            >
              <X size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}