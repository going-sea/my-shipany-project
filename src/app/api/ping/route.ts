import { respData, respErr } from '@/shared/lib/resp'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message) {
      return respErr("invalid params")
    }

    return respData({
      pong: `received message: ${message}`,
    })
  } catch (e) {
    console.log("test failed:", e)
    return respErr("test failed")
  }
}