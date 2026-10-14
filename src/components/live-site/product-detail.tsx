import Image from "next/image";
import { liveCategories, liveHref } from "@/lib/live-site";
import { Breadcrumb, container, ProductCards } from "./catalog";
import ProductGallery from "./product-gallery";

const materials = [["下座", "PC"], ["上盖", "PC"], ["轴芯", "POM"], ["齿轮", "POM"], ["胶圈", "硅胶"], ["油", "硅油"]];
const tags = [
  ["齿轮阻尼器", "/index.php/products/chilunzuniqi.html"],
  ["家电阻尼器", "/index.php/products/jiadianzuniqi.html"],
  ["汽车扶手箱阻尼器", "/index.php/products/qichefushouxiangzuniqi.html"],
  ["减震阻尼器", "/index.php/products/jianzhenzuniqi.html"],
  ["汽车把手套缓冲器", "/index.php/products/qichebashoutaohuanchongqi.html"],
];

export default function ProductDetail() {
  return <><Breadcrumb product /><div className={`${container} grid items-start gap-8 pb-12 lg:grid-cols-[190px_minmax(0,1fr)]`}>
    <aside className="space-y-8 lg:sticky lg:top-24">
      <nav aria-label="产品类别"><h2 className="mb-3 font-bold">产品类别</h2><ul className="flex flex-wrap gap-2 lg:block lg:space-y-1">{liveCategories.map(item => <li key={item.path}><a href={liveHref(item.path)} className={`block rounded px-3 py-2.5 text-sm ${item.path === "/gear-damper/" ? "bg-brand-50 font-bold text-brand-700" : "hover:bg-white"}`}>{item.label}</a></li>)}</ul></nav>
      <div className="hidden lg:block"><h2 className="mb-3 font-bold">标签</h2><div className="flex flex-wrap gap-2">{tags.map(([label, path]) => <a key={path} href={liveHref(path)} className="rounded border border-line px-2 py-1 text-xs text-muted hover:text-brand-700">{label}</a>)}</div></div>
    </aside>
    <div className="min-w-0">
      <section className="grid items-start gap-7 md:grid-cols-2">
        <ProductGallery />
        <div><p className="mb-2 text-sm font-semibold text-brand-700">齿轮阻尼器 · 双向阻尼</p><h1 className="text-3xl font-bold leading-tight tracking-tight lg:text-4xl">RD-T038 / RD-V038</h1>
          <p className="mt-4 text-base leading-7 text-muted">适用于汽车内饰、家用电器和工业机械，支持螺钉安装，无角度限制。</p>
          <div className="mt-6 border-y border-line py-5"><p className="text-sm text-muted">扭矩范围</p><p className="mt-1 text-3xl font-bold tabular-nums">200–1000 <span className="text-base font-medium text-muted">gf·cm</span></p></div>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">{[["阻尼方向", "双向"], ["安装方式", "螺钉"], ["旋转角度", "无角度限制"], ["齿轮材质", "POM"]].map(([label, value]) => <div key={label}><dt className="text-muted">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}</dl>
          <div className="mt-7 flex flex-wrap gap-3"><a href={liveHref("/index.php/Content/Pagedis/lists/id/42/catid/6/hcatid/42.html")} className="rounded-md bg-brand-500 px-6 py-3 text-sm font-bold text-white">立即咨询</a><a href="tel:076982937929" className="rounded-md border border-line bg-white px-6 py-3 text-sm font-bold">电话咨询</a></div>
          <p className="mt-4 text-xs leading-6 text-muted">选型时请提供应用结构、目标扭矩及安装要求，具体规格以双方确认的图纸为准。</p>
        </div>
      </section>
      <div className="mt-12 space-y-10">
        <section aria-labelledby="materials"><h2 id="materials" className="mb-5 text-xl font-bold">部位零件与材质</h2><div className="overflow-hidden rounded-lg border border-line"><table className="w-full bg-white text-left text-sm"><thead className="bg-surface"><tr><th scope="col" className="px-5 py-3">部位</th><th scope="col" className="px-5 py-3">材质</th></tr></thead><tbody>{materials.map(([label, value]) => <tr key={label} className="border-t border-line-soft"><th scope="row" className="px-5 py-3 font-medium">{label}</th><td className="px-5 py-3">{value}</td></tr>)}</tbody></table></div></section>
        <section className="rounded-lg border border-line bg-white p-6"><h2 className="text-xl font-bold">阻尼测试</h2><p className="mt-4 text-sm leading-7 text-muted">常温 23°C 下，正转一圈 / 1 秒 → 暂停 1 秒 → 反转一圈 / 1 秒 → 暂停 1 秒。原产品资料标注测试寿命为 30,000 次。</p></section>
        <section><h2 className="mb-4 text-xl font-bold">齿轮阻尼器的应用与优势</h2><p className="text-sm leading-8 text-muted">通过阻尼控制，减缓开合过程中的冲击与噪音，提升机构操作手感。可用于汽车杯架及内饰机构、家电、办公用品和其他需要缓冲的结构。特澳支持按应用要求进行扭矩与结构定制，实际适配需要结合机构负载、运动速度与安装空间评估。</p></section>
        <section><h2 className="mb-4 text-xl font-bold">技术规格</h2><div className="overflow-x-auto rounded-lg border border-line"><table className="w-full bg-white text-left text-sm"><thead className="bg-surface"><tr>{["型号", "RD-T038", "RD-V038"].map(value => <th scope="col" key={value} className="px-5 py-3">{value}</th>)}</tr></thead><tbody>{[["齿数", "11", "11"], ["压力角", "20°", "20°"], ["齿轮材质", "POM", "POM"]].map(([label, a, b]) => <tr key={label} className="border-t border-line"><th scope="row" className="px-5 py-3 font-medium">{label}</th><td className="px-5 py-3">{a}</td><td className="px-5 py-3">{b}</td></tr>)}</tbody></table></div></section>
        <section><h2 className="mb-5 text-xl font-bold">阻尼性能</h2><div className="grid gap-6 md:grid-cols-2">{[
          ["6530cb98cf8ec.jpg", "转速与扭矩", "23°C 环境温度下，扭矩随转速变化，通常随转速增加而增大。"],
          ["6530cba6cb1d4.jpg", "温度与扭矩", "20 r/min 转速下，扭矩随环境温度变化，通常低温时增大、高温时减小。"],
        ].map(([file, title, text]) => <figure key={file} className="rounded-lg border border-line bg-white p-4"><div className="relative aspect-[1.4]"><Image src={`/images/live-site/${file}`} alt={`${title}性能曲线`} fill sizes="(max-width: 768px) 90vw, 440px" className="object-contain" /></div><figcaption className="mt-4"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-7 text-muted">{text}</p></figcaption></figure>)}</div></section>
        <section><h2 className="mb-4 text-xl font-bold">应用演示</h2><div className="relative aspect-video max-w-xl overflow-hidden rounded-lg border border-line bg-white"><Image src="/images/live-site/654b2cd43ea89.gif" alt="RD-T038 / RD-V038 原站应用演示" fill unoptimized className="object-contain" /></div></section>
        <nav aria-label="相邻产品" className="flex flex-wrap justify-between gap-4 border-y border-line py-5 text-sm"><a href={liveHref("/gear-damper/gear-rotary-damper-rd-t068-v068.html")}>上一个产品：RD-T068 / RD-V068</a><a href={liveHref("/gear-damper/gear-rotary-damper- RD-T038A/V038A.html")}>下一个产品：RD-T038A / RD-V038A</a></nav>
      </div>
    </div>
  </div><section className={`${container} border-t border-line py-10`}><h2 className="mb-6 text-2xl font-bold">相关产品</h2><ProductCards related /></section></>;
}
