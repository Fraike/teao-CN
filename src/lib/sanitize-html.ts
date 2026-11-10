/** 轻量 HTML 清洗:移除脚本/样式/事件属性与 javascript: 链接。后台内容为可信来源,这里是兜底。 */
export function sanitizeHtml(html: string): string {
  return String(html ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"')
    .replace(/(href|src)\s*=\s*javascript:[^\s>]+/gi, '$1="#"');
}
