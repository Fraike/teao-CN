import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { liveHref } from "@/lib/live-site";
import { container } from "./catalog";
import type { ApplicationScene } from "@/content/live-site/applications";

export default function ApplicationScenesPage({ eyebrow, title, description, scenes }: {
  eyebrow: string;
  title: string;
  description: string;
  scenes: ApplicationScene[];
}) {
  return (
    <section className={`${container} py-14`}>
      <h1 className="sr-only">{title} | 特澳 TEAO</h1>
      <SectionHead eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-4">
        {scenes.map((scene, i) => (
          <Reveal key={scene.id} delay={(Math.min(i, 2) + 1) as 1 | 2 | 3}>
            <article className="overflow-hidden rounded-2xl border border-line bg-white p-5 lg:p-6">
              <div className="mb-4 flex items-center gap-3">
                <em className="not-italic text-lg font-black leading-none text-brand-500">{scene.no}</em>
                <h2 className="text-[17px] font-bold leading-tight">{scene.title}</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line-soft bg-surface">
                  <Image src={scene.gif} alt={scene.title} fill unoptimized className="object-contain p-2" sizes="(max-width: 768px) 100vw, 420px" />
                </div>
                <div>
                  <p className="mb-4 text-sm leading-relaxed text-muted">{scene.description}</p>
                  <div className="space-y-2.5">
                    {scene.groups.map((group) => (
                      <div key={group.title} className="overflow-hidden rounded-lg border border-line">
                        <div className="flex min-h-[36px] items-center justify-between bg-surface px-3 text-xs font-bold">
                          <Link href={liveHref(group.categoryPath)} className="text-brand-700 hover:underline">{group.title}</Link>
                        </div>
                        <div className="flex flex-wrap gap-2 px-3 py-2.5">
                          {group.models.map((model) => (
                            <span key={model} className="rounded-md bg-surface px-2.5 py-1 text-xs font-bold text-ink-soft">{model}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
