// 百度搜索资源平台主动推送。token 只从环境变量读取，不写入仓库。
const SITE_URL = "https://www.chinateao.com";
// 百度 API 的 site 参数要求是不带协议的站点名；带 https:// 会返回 site init fail。
const SITE_PARAM = "www.chinateao.com";
const PUSH_ENDPOINT = "http://data.zz.baidu.com/urls";
const DELETE_ENDPOINT = "http://data.zz.baidu.com/del";
const TIMEOUT_MS = 8000;

function token() {
  return (process.env.BAIDU_PUSH_TOKEN ?? "").trim();
}

function absoluteUrls(paths: string[]) {
  const seen = new Set<string>();
  return paths.flatMap(path => {
    if (!path) return [];
    const url = path.startsWith("http")
      ? path
      : SITE_URL + encodeURI(path.startsWith("/") ? path : `/${path}`);
    if (seen.has(url)) return [];
    seen.add(url);
    return [url];
  });
}

async function send(endpoint: string, paths: string[]) {
  const secret = token();
  const urls = absoluteUrls(paths);
  if (!secret || urls.length === 0) return { skipped: true as const };

  try {
    const response = await fetch(
      `${endpoint}?site=${encodeURIComponent(SITE_PARAM)}&token=${encodeURIComponent(secret)}`,
      {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: urls.join("\n"),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    );
    const data = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    if (!response.ok || (data && "error" in data)) {
      console.warn("[baidu-push] failed", {
        status: response.status,
        error: data?.error,
        message: data?.message,
      });
    } else {
      console.info("[baidu-push]", endpoint.endsWith("/del") ? "deleted" : "pushed", {
        count: urls.length,
        remain: data?.remain,
        success: data?.success,
      });
    }
    return { ok: response.ok && !(data && "error" in data), data };
  } catch (error) {
    console.warn("[baidu-push] request failed", error instanceof Error ? error.message : error);
    return { ok: false as const };
  }
}

export async function pushBaiduUrls(paths: string[]) {
  return send(PUSH_ENDPOINT, paths);
}

export async function deleteBaiduUrls(paths: string[]) {
  return send(DELETE_ENDPOINT, paths);
}

/** 不阻塞后台保存；没有 token 时自动跳过。 */
export function scheduleBaiduPush(paths: string[], action: "push" | "delete" = "push") {
  if (!token()) return;
  const run = action === "push" ? pushBaiduUrls : deleteBaiduUrls;
  void run(paths).catch(() => {});
}
