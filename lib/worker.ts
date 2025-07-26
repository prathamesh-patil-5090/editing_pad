class WorkerManager {
  private worker: Worker | null = null
  private messageId = 0
  private pendingMessages = new Map<number, { resolve: Function; reject: Function }>()

  constructor() {
    if (typeof window !== 'undefined') {
      this.initWorker()
    }
  }

  private initWorker() {
    this.worker = new Worker('/worker.js')
    
    this.worker.onmessage = (e) => {
      const { type, payload, id } = e.data
      
      if (this.pendingMessages.has(id)) {
        const { resolve, reject } = this.pendingMessages.get(id)!
        this.pendingMessages.delete(id)
        
        if (type === 'ERROR') {
          reject(new Error(payload.message))
        } else {
          resolve(payload)
        }
      }
    }

    this.worker.onerror = (error) => {
      console.error('Worker error:', error)
    }
  }

  private sendMessage(type: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not initialized'))
        return
      }

      const id = ++this.messageId
      this.pendingMessages.set(id, { resolve, reject })
      
      this.worker.postMessage({ type, payload, id })
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingMessages.has(id)) {
          this.pendingMessages.delete(id)
          reject(new Error('Worker timeout'))
        }
      }, 30000)
    })
  }

  async compileCode(code: string, language: string) {
    return this.sendMessage('COMPILE_CODE', { code, language })
  }

  async parseFile(content: string, language: string) {
    return this.sendMessage('PARSE_FILE', { content, language })
  }

  async formatCode(code: string, language: string) {
    return this.sendMessage('FORMAT_CODE', { code, language })
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.pendingMessages.clear()
  }
}

export const workerManager = new WorkerManager()