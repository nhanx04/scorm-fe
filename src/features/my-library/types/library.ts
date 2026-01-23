// LIMIT THE FILE CONTENT TO AT MOST 300 LINES. IF MORE CONTENT NEEDS TO BE ADDED USE THE str-replace-editor TOOL TO EDIT THE FILE AFTER IT HAS BEEN CREATED.
/*
 * Type definitions for the My Library feature
 */

export type ScopeType = 'PRIVATE' | 'PUBLIC'

export interface Library {
  libraryId: number
  libraryName: string
  description?: string
  scopeType: ScopeType
  updatedAt: string
}

export type MediaType = 'IMAGE' | 'DOCUMENT' | 'AUDIO' | 'VIDEO'

export interface MediaMetadata {
  // Metadata differs per provider / media type, so leave as unknown structure
  [key: string]: unknown
}

export interface MediaItem {
  mediaId: number
  title: string
  description?: string | null
  originalFileName?: string | null
  mediaType: MediaType
  uploadedAt: string
  metadata: MediaMetadata
}

