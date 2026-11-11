import Image from "next/image";
import { liveCategories, liveHref, liveNavigation, type LiveNavItem } from "@/lib/live-site";
import { contact, telHref } from "@/content/live-site/contact";

function NavList({ items }: { items: LiveNavItem[] }) {
  return <ul className="space-y-1">{items.map(item => <li key={item.path}>
    <a className="block rounded px-3 py-2 text-body hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-brand-500" href={liveHref(item.path)}>{item.label}</a>
    {item.children && <div className="ml-3 border-l border-line pl-2"><NavList items={item.children} /></div>}
  </li>)}</ul>;
}

function SearchForm() {
  return <form action={liveHref("/index.php/Search/Index/index.html")} method="get" className="flex gap-2">
    <label className="sr-only" htmlFor="live-site-search">搜索产品与资料</label>
    <input id="live-site-search" name="q" type="search" required placeholder="搜索产品与资料" className="min-w-0 flex-1 rounded border border-line px-3 py-2 text-body" />
    <button type="submit" className="rounded bg-brand-500 px-3 py-2 text-body font-semibold text-white">搜索</button>
  </form>;
}

export function LiveHeader() {
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-white">
    <div className="mx-auto flex h-[73px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
      <a href={liveHref("/")} aria-label="特澳首页" className="flex shrink-0 items-center gap-2">
        <Image src="/images/logo-color.webp" width={96} height={36} alt="特澳 TEAO" priority className="h-9 w-auto object-contain" />
        <span className="text-xl font-black text-brand-700">TEAO <span className="text-body-lg text-ink">特澳</span></span>
      </a>
      <nav aria-label="主导航" className="hidden items-center gap-5 xl:flex">
        {liveNavigation.map(item => item.children ? <details key={item.path} className="group relative">
          <summary className="cursor-pointer py-5 text-body font-semibold marker:text-brand-500">{item.label}</summary>
          <div className="absolute left-0 top-full max-h-[70vh] w-56 overflow-y-auto rounded-b-lg border border-line bg-white p-3 shadow-lg">
            <a href={liveHref(item.path)} className="mb-2 block border-b border-line px-3 pb-3 font-semibold text-brand-700">{item.label}首页</a>
            <NavList items={item.children} />
          </div>
        </details> : <a key={item.path} href={liveHref(item.path)} className="py-5 text-body font-semibold hover:text-brand-700">{item.label}</a>)}
      </nav>
      <div className="hidden items-center gap-4 xl:flex"><a href={liveHref("/convert/")} className="text-xs text-muted hover:text-brand-700">扭矩换算</a></div>
      <a href={telHref(contact.primaryMobile)} className="ml-auto hidden text-body font-bold text-brand-700 sm:block xl:ml-0">{contact.primaryMobile}</a>
      <details className="relative xl:hidden">
        <summary className="cursor-pointer rounded border border-line px-3 py-2 text-body font-semibold">菜单</summary>
        <nav aria-label="手机导航" className="absolute right-0 top-14 max-h-[75vh] w-[min(320px,calc(100vw-40px))] overflow-y-auto rounded-lg border border-line bg-white p-4 shadow-lg"><NavList items={liveNavigation} /><a className="mt-2 block border-t border-line px-3 py-3 text-body" href={liveHref("/convert/")}>扭矩换算</a></nav>
      </details>
    </div>
  </header>;
}

export function LiveFooter() {
  return <footer className="border-t border-line bg-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
      <div><p className="text-xl font-bold">东莞特澳</p><p className="mt-3 text-body leading-7 text-muted">阻尼器、缓冲器与锁扣机构<br />研发、生产与定制服务</p></div>
      <div><h2 className="mb-3 font-bold">快速链接</h2><NavList items={liveNavigation.filter(item => item.path !== "/products/").map(({ label, path }) => ({ label, path }))} /></div>
      <div><h2 className="mb-3 font-bold">产品</h2><NavList items={liveCategories} /></div>
      <div className="space-y-3 text-body"><h2 className="text-body-lg font-bold">联系我们</h2><p><a href={telHref(contact.primaryMobile)}>{contact.primaryName} {contact.primaryMobile}</a></p><p><a href={telHref(contact.primaryMobile)}>0769 8293 7929</a></p><p><a href={`mailto:${contact.email}`}>{contact.email}</a></p><p className="text-muted">广东省东莞市黄江镇黄江北街2号</p><a className="inline-block text-brand-700" href={liveHref("/contacts/")}>联系销售团队</a></div>
    </div>
    <div className="mx-auto mb-8 max-w-md px-5"><SearchForm /></div>
    <div className="border-t border-line px-5 py-5 text-center text-xs text-muted">© {new Date().getFullYear()} 东莞市特澳电子科技有限公司 · <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">粤ICP备13044030号-2</a></div>
  </footer>;
}
