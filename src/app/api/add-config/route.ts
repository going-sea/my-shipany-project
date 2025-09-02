import { respData, respErr } from "@/lib/resp";
import { addConfig } from "@/services/config";

export async function POST(request: Request) {
  try {
    const { name, value } = await request.json();
    if (!name || !value) {
      return respErr("name and value are required");
    }

    const config = await addConfig({ name, value });

    return respData(config);
  } catch (e) {
    console.log("add config failed:", e);
    return respErr("add config failed");
  }
}
