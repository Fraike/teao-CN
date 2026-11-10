import { sanitizeHtml } from "./sanitize-html";

export interface ArticleHeading {
  id: string;
  text: string;
}

const stripTags = (html: string) => String(html).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

/** 清洗正文,并给 H2 注入锚点 id,供侧栏目录使用。 */
export function prepareArticleHtml(input: string): { html: string; headings: ArticleHeading[] } {
  const headings: ArticleHeading[] = [];
  const html = sanitizeHtml(input).replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_match, attrs: string, inner: string) => {
    const id = `h-${headings.length + 1}`;
    const text = stripTags(inner);
    if (text) headings.push({ id, text });
    return `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });
  return { html, headings };
}
