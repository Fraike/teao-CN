import { PageHero } from "@/components/ui/page-hero";
import { container } from "./container";
import { getPublishedNews } from "@/lib/news-store";
import NewsList from "./news-list";
import InquiryCTA from "./inquiry-cta";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const articles = await getPublishedNews();
  const newsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "新闻",
    description: "特澳最新动态、阻尼器工程进展、质量管理与技术资源。",
    url: "https://www.chinateao.com/news/",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, i) => ({
        "@type": "ListItem", position: i + 1,
        item: { "@type": "NewsArticle", name: article.title, url: `https://www.chinateao.com/news/${article.slug}.html` },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }} />
      <PageHero
        eyebrow="新闻"
        title="公司动态与工程进展"
        description="特澳最新动态、阻尼器工程进展、质量管理与技术资源。"
        breadcrumb={[{ label: "首页", href: "/" }, { label: "新闻" }]}
      />

      <div className={`${container} py-16 lg:py-20`}>
        <NewsList articles={articles} />
      </div>

      <InquiryCTA />
    </>
  );
}
