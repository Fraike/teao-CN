import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { liveHref } from "@/lib/live-site";
import { formatRange, getProductContentByModel } from "@/lib/product-content";
import { container } from "./container";
import type { ApplicationMap, ApplicationScene } from "@/content/live-site/applications";
import AutomotiveMap from "./automotive-map";

export default function ApplicationScenesPage({ eyebrow, title, description, scenes, map }: {
  eyebrow: string;
  title: string;
  description: string;
  scenes: ApplicationScene[];
  map: ApplicationMap;
}) {
  return (
    <section className={`${container} py-14`}>
      <h1 className="sr-only">{title} | 特澳 TEAO</h1>
      <SectionHead eyebrow={eyebrow} title={title} description={description} />

      <AutomotiveMap map={map} sceneIds={scenes.map(scene => scene.id)} />

      <div className="mt-6 grid gap-4">
        {scenes.map((scene, i) => {
          const modelCount = scene.groups.reduce((sum, group) => sum + group.models.length, 0);
          return (
            <Reveal key={scene.id} delay={(Math.min(i, 2) + 1) as 1 | 2 | 3}>
              <article id={scene.id} className="scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-white p-5 transition-colors duration-300 hover:border-brand-500/30 lg:p-6">
                <div className="mb-5 flex items-center gap-3 border-b border-line-soft pb-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-sm font-black text-brand-700">{scene.no}</span>
                  <div className="min-w-0">
                    <h2 className="text-[17px] font-bold leading-tight">{scene.title}</h2>
                    <p className="mt-0.5 text-[11px] text-muted-light">{modelCount} 个推荐型号</p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line-soft bg-surface">
                    <Image src={scene.gif} alt={scene.title} fill unoptimized className="object-contain p-2" sizes="(max-width: 768px) 100vw, 420px" />
                  </div>

                  <div className="flex flex-col">
                    <p className="text-sm leading-relaxed text-muted">{scene.description}</p>

                    <div className="mt-4 flex-1 rounded-2xl border border-line bg-surface/60 p-3.5">
                      <div className="mb-2.5 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-light">推荐型号</span>
                        <span className="text-[10px] font-semibold text-muted-light">按应用可调扭矩</span>
                      </div>

                      <div className="space-y-3">
                        {scene.groups.map(group => (
                          <div key={group.title}>
                            <Link href={liveHref(group.categoryPath)} className="mb-1.5 inline-flex items-center gap-1 text-[12px] font-bold text-brand-700 hover:underline">
                              {group.title}
                              <ArrowUpRight size={12} />
                            </Link>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {group.models.map(model => {
                                const item = getProductContentByModel(model);
                                if (!item) {
                                  return (
                                    <span key={model} className="rounded-xl border border-dashed border-line bg-white px-3 py-2 text-[12px] font-bold text-ink-soft">
                                      {model}
                                    </span>
                                  );
                                }
                                const range = item.torque
                                  ? `扭矩 ${formatRange(item.torque)}`
                                  : item.force
                                    ? `操作力 ${formatRange(item.force)}`
                                    : "扭矩可定制";
                                return (
                                  <Link
                                    key={model}
                                    href={item.path}
                                    className="group flex items-center gap-2.5 rounded-xl border border-line bg-white p-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-[0_8px_20px_rgba(232,120,26,0.1)]"
                                  >
                                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-surface">
                                      {item.images[0] && (
                                        <Image src={item.images[0].url} alt={item.model} fill sizes="36px" className="object-contain p-1" />
                                      )}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span className="block truncate text-[12px] font-bold text-ink group-hover:text-brand-700">{item.model}</span>
                                      <span className="block truncate text-[10px] text-muted">{range}</span>
                                    </span>
                                    <ArrowUpRight size={13} className="shrink-0 text-muted-light transition-colors group-hover:text-brand-700" />
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
