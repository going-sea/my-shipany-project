import { respData, respErr } from "@/lib/resp";
import { getConfigs } from "@/services/config";

export async function POST() {
  try {
    const configs = await getConfigs();

    return respData(configs);
  } catch (e) {
    console.log("get config failed:", e);
    return respErr("get config failed");
  }
}
