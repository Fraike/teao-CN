import Image from "next/image";

const products = [
  {
    title: "齿轮阻尼器",
    alias: "旋转阻尼器 / 齿轮缓冲器",
    image: "/images/products/gear-damper/GearDamperCategory.webp",
  },
  {
    title: "轴向阻尼器",
    alias: "圆筒阻尼器 / 桶形阻尼器",
    image: "/images/products/axial-damper/AxialDamperCategory.webp",
  },
  {
    title: "手套箱阻尼器",
    alias: "汽车杂物箱缓降阻尼器",
    image: "/images/products/glove-box-damper/GloveBoxDamperCategory.webp",
  },
  {
    title: "锁扣",
    alias: "Push-Push 锁扣 / 汽车内饰锁扣",
    image: "/images/products/latch/LatchCategory.webp",
  },
  {
    title: "其他定制零部件",
    alias: "定制缓冲机构 / 收纳机构",
    image: "/images/products/other/OthersCategory.webp",
  },
];

const nextSteps = [
  ["资料确认", "主定位、产品分类、工厂素材、客户授权、联系方式。"],
  ["内容模型", "产品事实数据统一，中文内容自动生成草稿后审核发布。"],
  ["页面开发", "首页、产品中心、应用领域、制造实力、质量认证、联系我们。"],
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/company/automation-workshop.webp"
          alt="特澳自动化生产车间"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(250,250,251,.98)_0%,rgba(250,250,251,.88)_48%,rgba(250,250,251,.22)_100%)]" />
        <div className="relative mx-auto grid min-h-[640px] max-w-7xl content-center px-5 py-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.6fr)] lg:px-8">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-brand-500/20 bg-white/80 px-4 py-2 text-xs font-black text-brand-700 shadow-sm backdrop-blur">
              面向国内客户的特澳 TEAO 中文独立站
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-[-0.03em] text-ink sm:text-5xl lg:text-7xl">
              汽车内饰阻尼器与锁扣定制厂家
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted lg:text-xl">
              中文站从独立项目开始建设，页面展示将更符合国内 B2B 浏览习惯：少长文案、强产品、强工厂、强质量、强询盘。
            </p>
            <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {["20+ 年经验", "IATF 16949", "8000 万年产能", "支持图纸定制"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/70 bg-white/80 p-4 text-sm font-black text-ink-soft shadow-sm backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="mt-10 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-xl backdrop-blur lg:mt-0">
            <h2 className="text-lg font-black">当前开工状态</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted">
              <p>项目骨架已建立，后续从这里开发中文独立站。</p>
              <p>内容同步采用统一后台发布，中文站和英文站各自本地读取已发布副本。</p>
              <p>完整首页和产品页会在资料确认后进入正式设计和开发。</p>
            </div>
          </aside>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black text-brand-500">产品方向</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.02em]">
              先按五大核心产品线启动
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted">
            后续需要确认空气阻尼器、线性阻尼器是否继续作为中文站一级分类。
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {products.map((product) => (
            <article
              key={product.title}
              className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-surface">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-black">{product.title}</h3>
                <p className="mt-1 min-h-10 text-sm leading-5 text-muted">
                  {product.alias}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Next Steps */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 lg:grid-cols-3 lg:px-8">
          {nextSteps.map(([title, text]) => (
            <div key={title} className="rounded-2xl bg-surface p-6">
              <h3 className="font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
