import type { KeryxApi } from '@keryx/core'

declare global {
  interface Window {
    keryx: KeryxApi
  }
}

export {}
