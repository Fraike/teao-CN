import Link from "next/link";
import { container } from "./container";

export default function InquiryCTA() {
  return (
    <section className="border-t border-line bg-white">
      <div className={`${container} py-14 text-center lg:py-20`}>
        <h2 className="text-[28px] font-extrabold tracking-tight text-ink sm:text-[34px]">没有找到合适的型号?</h2>
        <p className="mx-auto mb-8 mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
          提供应用位置、目标扭矩、安装空间与预估用量,工程团队可推荐标准平台或按结构空间定制方案。
        </p>
        <Link
          href="/contacts/"
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(232,120,26,0.18)] transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-[0_8px_28px_rgba(232,120,26,0.28)]"
        >
          获取选型建议 →
        </Link>
      </div>
    </section>
  );
}
