"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ChevronDown } from "lucide-react";
import { TORQUE_UNITS, convertTorque, formatTorqueValue, isTeaoTorqueUnit, normalizeTorqueInput } from "@/lib/torque-conversion";

export default function TorqueConverter() {
  const [value, setValue] = useState<string>("1");
  const [unit, setUnit] = useState<string>("gf·cm");

  const results = useMemo(() => convertTorque(value, unit), [value, unit]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,.04)] lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="torque-value" className="sr-only">扭矩数值</label>
          <input
            id="torque-value"
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(event) => {
              const nextValue = normalizeTorqueInput(event.target.value);
              if (nextValue === null) return;
              setValue(nextValue);
            }}
            placeholder="输入数值…"
            className="h-14 flex-1 rounded-xl border border-line bg-white px-5 text-lg font-semibold text-ink transition-all placeholder:text-muted-light focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10"
          />
          <div className="relative sm:w-44">
            <select
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              aria-label="输入单位"
              className="h-14 w-full cursor-pointer appearance-none rounded-xl border border-line bg-white pl-5 pr-10 text-body font-semibold text-ink-soft transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10"
            >
              {TORQUE_UNITS.map((item) => (
                <option key={item.key} value={item.key}>{item.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-500" />
          </div>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <ArrowDown size={16} className="shrink-0 text-brand-500" strokeWidth={2.5} />
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-light">换算结果</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <p className="sr-only" aria-live="polite">
          {results
            ? `已按 ${value} ${TORQUE_UNITS.find(item => item.key === unit)?.label ?? unit} 换算`
            : "请输入扭矩数值"}
        </p>

        {results ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {results.map((result) => {
              const teaUnit = isTeaoTorqueUnit(result.key);
              return (
                <div
                  key={result.key}
                  className={`rounded-xl p-3.5 transition-all duration-300 lg:p-4 ${
                    teaUnit ? "border border-brand-500/40 bg-brand-50" : "border border-line bg-surface"
                  }`}
                >
                  <div className="mb-1 text-micro font-medium uppercase tracking-[0.08em] text-muted-light lg:text-micro">
                    {result.label}
                    {teaUnit && <span className="ml-1.5 text-micro text-brand-700">TEAO</span>}
                  </div>
                  <div className={`text-lg font-semibold tracking-[-0.03em] tabular-nums lg:text-xl ${teaUnit ? "text-brand-700" : "text-ink"}`}>
                    {formatTorqueValue(result.value)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-body text-muted-light">输入数值后查看换算结果</div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-muted-light">
        特澳阻尼器的扭矩通常以 gf·cm 标注。市场上的产品使用多种单位,可借助本工具快速对比。
      </p>
    </div>
  );
}
