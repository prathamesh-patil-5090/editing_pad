'use client'

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import FileTree from './FileTree'
import Editor from './Editor'
import FileTabs from './FileTabs'

export default function IDELayout() {
  return (
    <div className="h-screen bg-gray-900 text-white">
      <PanelGroup direction="horizontal">
        {/* Sidebar */}
        <Panel defaultSize={20} minSize={15} maxSize={40}>
          <FileTree className="h-full" />
        </Panel>
        
        <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600" />
        
        {/* Main Editor Area */}
        <Panel defaultSize={80}>
          <div className="h-full flex flex-col">
            <FileTabs />
            <div className="flex-1">
              <Editor className="h-full" />
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}