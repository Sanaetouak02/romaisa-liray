import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { filename, data } = body || {}
    if (!filename || !data) {
      return new Response(JSON.stringify({ error: 'Missing file' }), { status: 400 })
    }

    // Data expected as data:[mime];base64,xxxxx
    const matches = data.match(/^data:(.+);base64,(.+)$/)
    let buffer: Buffer
    let ext = path.extname(filename) || ''
    if (matches) {
      const b64 = matches[2]
      buffer = Buffer.from(b64, 'base64')
      const mime = matches[1]
      if (!ext) {
        // try derive ext
        if (mime === 'image/jpeg') ext = '.jpg'
        if (mime === 'image/png') ext = '.png'
        if (mime === 'image/webp') ext = '.webp'
      }
    } else {
      // assume raw base64 without prefix
      buffer = Buffer.from(data, 'base64')
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`
    const outPath = path.join(uploadsDir, uniqueName)
    await fs.writeFile(outPath, buffer)

    const url = `/uploads/${uniqueName}`
    return new Response(JSON.stringify({ url }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
