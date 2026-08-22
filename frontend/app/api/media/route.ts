import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const MEDIA_DIR = path.join(process.cwd(), 'public', 'media')

interface MediaFile {
  id: string
  filename: string
  type: 'image' | 'video' | 'document'
  url: string
  size: number
  createdAt: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as string | null

    const mediaList: MediaFile[] = []
    const categories = ['images', 'videos', 'documents']

    for (const category of categories) {
      if (type && category !== type + 's') continue

      const dirPath = path.join(MEDIA_DIR, category)

      if (!fs.existsSync(dirPath)) {
        continue
      }

      const files = fs.readdirSync(dirPath)

      for (const file of files) {
        const filePath = path.join(dirPath, file)
        const stats = fs.statSync(filePath)

        mediaList.push({
          id: file.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
          filename: file,
          type: category.slice(0, -1) as 'image' | 'video' | 'document',
          url: `/media/${category}/${file}`,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
        })
      }
    }

    return NextResponse.json({
      docs: mediaList,
      totalDocs: mediaList.length,
    })
  } catch (error) {
    console.error('Media list error:', error)
    return NextResponse.json(
      { error: 'Failed to list media' },
      { status: 500 }
    )
  }
}
