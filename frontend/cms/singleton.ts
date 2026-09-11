import { getPayload } from 'payload'
import config from './payload.config'

// Global singleton instance
let payloadInstance: Awaited<ReturnType<typeof getPayload>> | null = null
let isInitializing = false
let initPromise: Promise<Awaited<ReturnType<typeof getPayload>>> | null = null

export async function getPayloadSingleton() {
  // Return existing instance
  if (payloadInstance) {
    return payloadInstance
  }

  // Wait if already initializing
  if (isInitializing && initPromise) {
    return initPromise
  }

  // Start initialization
  isInitializing = true
  initPromise = getPayload({ config })
    .then((instance) => {
      payloadInstance = instance
      isInitializing = false
      console.log('[Payload] ✓ Initialized and cached')
      return instance
    })
    .catch((error) => {
      isInitializing = false
      console.error('[Payload] ✗ Initialization failed:', error)
      throw error
    })

  return initPromise
}
