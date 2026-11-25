"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import MediaPicker from "./media-picker";
import { slugFromModel } from "@/lib/product-admin";

type Range = { min: number; max: number; unit: string } | null;
type Spec = { label: string; value: string };
type ImageItem = { url: string; alt?: string };
type Material = { part: string; material: string };
type Scenario = { image: string; label: string };
type Variants = { variants: string[]; rows: { param: string; values: string[] }[] } | null;
type Durability = { cycles?: number; temperature?: string; test_method?: string } | null;
type Charts = { rotation: string | null; temperature: string | null } | null;

interface CategoryOption { slug: string; name: string; path: string }

interface FormState {
  slug: string;
  path: string;
  model: string;
  name: string;
  listingTitle: string;
  category: string;
  summary: string;
  description: string;
  image: string;
  images: ImageItem[];
  specifications: Spec[];
  torque: Range;
  force: Range;
  hardTorque: string;
  hardForce: string;
  soundType: string;
  bufferDirection: string;
  assemblyMethod: string;
  durability: Durability;
  materials: Material[];
  characteristics: string[];
  applications: string[];
  applicationScenarios: Scenario[];
  dimensionDrawing: string;
  performanceCharts: Charts;
  variants: Variants;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  isActive: boolean;
  sortOrder: number;
}

interface Props {
  initial?: Partial<FormState> & { id?: number };
  isNew?: boolean;
  categories: CategoryOption[];
}

export default function ProductForm({ initial, isNew = false, categories }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    slug: initial?.slug ?? "",
    path: initial?.path ?? "",
    model: initial?.model ?? "",
    name: initial?.name ?? "",
    listingTitle: initial?.listingTitle ?? "",
    category: initial?.category ?? categories[0]?.slug ?? "",
    summary: initial?.summary ?? "",
    description: initial?.description ?? "",
    image: initial?.image ?? "",
    images: initial?.images ?? [],
    specifications: initial?.specifications ?? [],
    torque: initial?.torque ?? null,
    force: initial?.force ?? null,
    hardTorque: initial?.hardTorque ?? "",
    hardForce: initial?.hardForce ?? "",
    soundType: initial?.soundType ?? "",
    bufferDirection: initial?.bufferDirection ?? "",
    assemblyMethod: initial?.assemblyMethod ?? "",
    durability: initial?.durability ?? null,
    materials: initial?.materials ?? [],
    characteristics: initial?.characteristics ?? [],
    applications: initial?.applications ?? [],
    applicationScenarios: initial?.applicationScenarios ?? [],
    dimensionDrawing: initial?.dimensionDrawing ?? "",
    performanceCharts: initial?.performanceCharts ?? { rotation: null, temperature: null },
    variants: initial?.variants ?? null,
    seoTitle: initial?.seoTitle ?? "",
    seoDescription: initial?.seoDescription ?? "",
    tags: initial?.tags ?? [],
    isActive: initial ? Boolean(initial.isActive) : true,
    sortOrder: initial?.sortOrder ?? 0,
  });
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [pathTouched, setPathTouched] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dirty, setDirty] = useState(false);

  const set = useCallback((field: keyof FormState, value: FormState[keyof FormState]) => {
    setDirty(true);
    setForm(previous => ({ ...previous, [field]: value }));
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function categoryFor(slug: string) {
    return categories.find(category => category.slug === slug);
  }

  function handleModel(value: string) {
    setDirty(true);
    setForm(previous => {
      const slug = !slugTouched && (!previous.slug || previous.slug === slugFromModel(previous.model || "")) ? slugFromModel(value) : previous.slug;
      const category = categoryFor(previous.category);
      const autoPath = category && slug ? `${category.path}${slug}.html` : previous.path;
      return { ...previous, model: value, slug, path: pathTouched ? previous.path : autoPath };
    });
  }

  function handleCategory(slug: string) {
    setDirty(true);
    setForm(previous => {
      const category = categoryFor(slug);
      const autoPath = category && previous.slug ? `${category.path}${previous.slug}.html` : previous.path;
      return { ...previous, category: slug, path: pathTouched ? previous.path : autoPath };
    });
  }

  async function submit(continueEditing = false) {
    setSaving(true);
    setError("");
    setNotice("");
    const payload = { ...form, isActive: form.isActive };
    try {
      const response = await fetch(isNew ? "/api/admin/products" : `/api/admin/products/${initial?.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "保存失败");
      setDirty(false);
      setNotice(isNew ? "商品已创建" : "修改已保存");
      if (isNew && continueEditing && data.id) {
        router.push(`/admin/products/${data.id}`);
        router.refresh();
      } else if (!continueEditing) {
        router.push("/admin/products");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!initial?.id) return;
    if (!confirm("确认删除该商品？此操作不可撤销。")) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/products/${initial.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "删除失败");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
      setSaving(false);
    }
  }

  const field = "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none placeholder:text-muted-light focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10";
  const label = "mb-1 block text-[13px] font-bold text-ink";

  return (
    <form onSubmit={event => { event.preventDefault(); void submit(false); }} className="space-y-6">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>}
      {notice && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{notice}</div>}

      <Section title="基本信息" description="型号、路径和分类决定前台 URL 与列表归属。">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={label}>型号 *</label><input className={field} value={form.model} onChange={event => handleModel(event.target.value)} required /></div>
          <div><label className={label}>Slug *</label><input className={field} value={form.slug} onChange={event => { setSlugTouched(true); set("slug", event.target.value); }} required /></div>
          <div className="sm:col-span-2">
            <label className={label}>历史路径 *</label>
            <input className={`${field} ${!isNew ? "bg-surface text-muted" : ""}`} value={form.path} onChange={event => { setPathTouched(true); set("path", event.target.value); }} readOnly={!isNew} required />
            <p className="mt-1 text-xs text-muted">{isNew ? "必须位于所选分类路径下，并以 .html 结尾。" : "已有商品的旧 URL 不可修改，避免破坏 SEO 和旧链接。"}</p>
          </div>
          <div>
            <label className={label}>分类 *</label>
            <select className={field} value={form.category} onChange={event => handleCategory(event.target.value)}>
              {categories.map(category => <option key={category.slug} value={category.slug}>{category.name}</option>)}
            </select>
          </div>
          <div><label className={label}>排序</label><input type="number" className={field} value={form.sortOrder} onChange={event => set("sortOrder", Number(event.target.value))} /></div>
          <div><label className={label}>产品名称 *</label><input className={field} value={form.name} onChange={event => set("name", event.target.value)} required /></div>
          <div><label className={label}>列表标题</label><input className={field} value={form.listingTitle} onChange={event => set("listingTitle", event.target.value)} /></div>
          <div className="sm:col-span-2"><label className={label}>摘要 *</label><textarea className={`${field} min-h-20 py-2`} value={form.summary} onChange={event => set("summary", event.target.value)} required /></div>
          <div className="sm:col-span-2"><label className={label}>详情描述</label><textarea className={`${field} min-h-24 py-2`} value={form.description} onChange={event => set("description", event.target.value)} /></div>
          <div><label className={label}>安装方式</label><input className={field} value={form.assemblyMethod} onChange={event => set("assemblyMethod", event.target.value)} /></div>
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold text-ink"><input type="checkbox" checked={form.isActive} onChange={event => set("isActive", event.target.checked)} /> 上架</label>
        </div>
      </Section>

      <Section title="图片" description="列表主图用于产品卡片；相册用于详情页；尺寸图和曲线可单独替换。">
        <div className="grid gap-4 sm:grid-cols-2">
          <MediaPicker label="列表主图 *" value={form.image} onChange={value => set("image", value)} />
          <MediaPicker label="尺寸图" value={form.dimensionDrawing} onChange={value => set("dimensionDrawing", value)} />
          <MediaPicker label="旋转性能曲线" value={form.performanceCharts?.rotation ?? ""} onChange={value => set("performanceCharts", { rotation: value || null, temperature: form.performanceCharts?.temperature ?? null })} />
          <MediaPicker label="温度性能曲线" value={form.performanceCharts?.temperature ?? ""} onChange={value => set("performanceCharts", { rotation: form.performanceCharts?.rotation ?? null, temperature: value || null })} />
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-black text-ink">产品相册</h3><button type="button" onClick={() => set("images", [...form.images, { url: "", alt: "" }])} className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"><Plus size={13} /> 添加图片</button></div>
          <div className="space-y-2">
            {form.images.map((image, index) => (
              <div key={index} className="grid gap-2 rounded-xl border border-line bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]">
                <MediaPicker value={image.url} onChange={url => { const next = [...form.images]; next[index] = { ...next[index], url }; set("images", next); }} />
                <input className={field} placeholder="alt 文本" value={image.alt ?? ""} onChange={event => { const next = [...form.images]; next[index] = { ...next[index], alt: event.target.value }; set("images", next); }} />
                <RowActions index={index} length={form.images.length} onMove={direction => set("images", moveItem(form.images, index, direction))} onRemove={() => set("images", removeItem(form.images, index))} />
              </div>
            ))}
            {form.images.length === 0 && <p className="text-xs text-muted">暂无相册图片。</p>}
          </div>
        </div>
      </Section>

      <Section title="扭矩 / 操作力 / 耐久" description="可调扭矩和操作力会显示在列表卡片与详情页。">
        <div className="grid gap-4 sm:grid-cols-2">
          <RangeEditor label="可调扭矩" range={form.torque} units={["gf·cm", "kgf·cm", "N·m"]} onChange={value => set("torque", value)} />
          <RangeEditor label="操作力" range={form.force} units={["N"]} onChange={value => set("force", value)} />
          <div><label className={label}>推荐扭矩</label><input className={field} value={form.hardTorque} onChange={event => set("hardTorque", event.target.value)} /></div>
          <div><label className={label}>按压力</label><input className={field} value={form.hardForce} onChange={event => set("hardForce", event.target.value)} /></div>
          <div><label className={label}>声音</label><input className={field} placeholder="有声 / 无声" value={form.soundType} onChange={event => set("soundType", event.target.value)} /></div>
          <div><label className={label}>阻尼方向</label><input className={field} placeholder="双向 / 单向" value={form.bufferDirection} onChange={event => set("bufferDirection", event.target.value)} /></div>
          <div><label className={label}>耐久循环次数</label><input type="number" className={field} value={form.durability?.cycles ?? ""} onChange={event => set("durability", event.target.value ? { ...(form.durability ?? {}), cycles: Number(event.target.value) } : null)} /></div>
        </div>
      </Section>

      <Section title="规格参数" description="按顺序显示在详情页规格表中；label 可重复。">
        <div className="space-y-2">
          {form.specifications.map((spec, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
              <input className={field} placeholder="label，如 尺寸" value={spec.label} onChange={event => { const next = [...form.specifications]; next[index] = { ...next[index], label: event.target.value }; set("specifications", next); }} />
              <input className={field} placeholder="value，如 Φ10.4" value={spec.value} onChange={event => { const next = [...form.specifications]; next[index] = { ...next[index], value: event.target.value }; set("specifications", next); }} />
              <RowActions index={index} length={form.specifications.length} onMove={direction => set("specifications", moveItem(form.specifications, index, direction))} onRemove={() => set("specifications", removeItem(form.specifications, index))} />
            </div>
          ))}
          <button type="button" onClick={() => set("specifications", [...form.specifications, { label: "", value: "" }])} className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"><Plus size={13} /> 添加规格</button>
        </div>
      </Section>

      <Section title="材料" description="详情页材料表。">
        <div className="space-y-2">
          {form.materials.map((material, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input className={field} placeholder="部件" value={material.part} onChange={event => { const next = [...form.materials]; next[index] = { ...next[index], part: event.target.value }; set("materials", next); }} />
              <input className={field} placeholder="材料" value={material.material} onChange={event => { const next = [...form.materials]; next[index] = { ...next[index], material: event.target.value }; set("materials", next); }} />
              <RowActions index={index} length={form.materials.length} onMove={direction => set("materials", moveItem(form.materials, index, direction))} onRemove={() => set("materials", removeItem(form.materials, index))} />
            </div>
          ))}
          <button type="button" onClick={() => set("materials", [...form.materials, { part: "", material: "" }])} className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"><Plus size={13} /> 添加材料</button>
        </div>
      </Section>

      <Section title="特性 / 应用 / 标签" description="用于列表、详情页和站内搜索。">
        <div className="grid gap-5 lg:grid-cols-3">
          <ChipEditor label="产品特性" values={form.characteristics} onChange={value => set("characteristics", value)} placeholder="如 卡扣" />
          <ChipEditor label="应用领域" values={form.applications} onChange={value => set("applications", value)} placeholder="如 汽车内外饰" />
          <ChipEditor label="标签" values={form.tags} onChange={value => set("tags", value)} placeholder="如 阻尼器" />
        </div>
      </Section>

      <Section title="应用场景" description="每个场景一张图片 + 一个标签。">
        <div className="space-y-2">
          {form.applicationScenarios.map((scenario, index) => (
            <div key={index} className="grid gap-2 rounded-xl border border-line bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]">
              <MediaPicker value={scenario.image} onChange={value => { const next = [...form.applicationScenarios]; next[index] = { ...next[index], image: value }; set("applicationScenarios", next); }} />
              <input className={field} placeholder="场景标签" value={scenario.label} onChange={event => { const next = [...form.applicationScenarios]; next[index] = { ...next[index], label: event.target.value }; set("applicationScenarios", next); }} />
              <RowActions index={index} length={form.applicationScenarios.length} onMove={direction => set("applicationScenarios", moveItem(form.applicationScenarios, index, direction))} onRemove={() => set("applicationScenarios", removeItem(form.applicationScenarios, index))} />
            </div>
          ))}
          <button type="button" onClick={() => set("applicationScenarios", [...form.applicationScenarios, { image: "", label: "" }])} className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"><Plus size={13} /> 添加场景</button>
        </div>
      </Section>

      <Section title="型号对比" description="用于详情页的型号对比表；每行数值数量必须等于型号数量。">
        {!form.variants ? (
          <button type="button" onClick={() => set("variants", { variants: [], rows: [] })} className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"><Plus size={13} /> 添加型号对比</button>
        ) : (
          <VariantsEditor value={form.variants} onChange={value => set("variants", value)} onRemove={() => set("variants", null)} />
        )}
      </Section>

      <Section title="搜索优化" description="不填则由型号、名称和摘要自动生成。">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={label}>SEO 标题</label><input className={field} value={form.seoTitle} onChange={event => set("seoTitle", event.target.value)} /></div>
          <div><label className={label}>SEO 描述</label><input className={field} value={form.seoDescription} onChange={event => set("seoDescription", event.target.value)} /></div>
        </div>
      </Section>

      <div className="sticky bottom-0 z-20 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur">
        <button type="submit" disabled={saving} className="inline-flex h-10 items-center rounded-full bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50">{saving ? "保存中…" : isNew ? "创建商品" : "保存修改"}</button>
        <button type="button" onClick={() => void submit(true)} disabled={saving} className="inline-flex h-10 items-center rounded-full border border-line px-5 text-sm font-bold text-ink-soft hover:border-brand-500 disabled:opacity-50">保存并继续编辑</button>
        <Link href="/admin/products" onClick={event => { if (dirty && !confirm("有未保存的修改，确认离开？")) event.preventDefault(); }} className="inline-flex h-10 items-center rounded-full border border-line px-5 text-sm font-bold text-muted hover:border-brand-500">取消</Link>
        {!isNew && <button type="button" onClick={() => void remove()} disabled={saving} className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-full border border-red-200 px-5 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 size={14} /> 删除商品</button>}
      </div>
    </form>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 lg:p-6">
      <div className="mb-4 border-b border-line-soft pb-3">
        <h2 className="text-base font-black text-ink">{title}</h2>
        {description && <p className="mt-1 text-xs text-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function RowActions({ index, length, onMove, onRemove }: { index: number; length: number; onMove: (direction: -1 | 1) => void; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:border-brand-500 disabled:opacity-30" aria-label="上移"><ArrowUp size={14} /></button>
      <button type="button" onClick={() => onMove(1)} disabled={index === length - 1} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:border-brand-500 disabled:opacity-30" aria-label="下移"><ArrowDown size={14} /></button>
      <button type="button" onClick={onRemove} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:border-red-300 hover:text-red-600" aria-label="删除"><Trash2 size={14} /></button>
    </div>
  );
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function removeItem<T>(items: T[], index: number): T[] {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

function RangeEditor({ label, range, units, onChange }: { label: string; range: Range; units: string[]; onChange: (range: Range) => void }) {
  const enabled = Boolean(range);
  return (
    <div>
      <label className="mb-1 flex items-center gap-2 text-[13px] font-bold text-ink">
        <input type="checkbox" checked={enabled} onChange={event => onChange(event.target.checked ? { min: 0, max: 0, unit: units[0] } : null)} /> {label}
      </label>
      {enabled && range ? (
        <div className="grid grid-cols-[1fr_1fr_110px] gap-2">
          <input type="number" className="h-10 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500" value={range.min} onChange={event => onChange({ ...range, min: Number(event.target.value) })} />
          <input type="number" className="h-10 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500" value={range.max} onChange={event => onChange({ ...range, max: Number(event.target.value) })} />
          <select className="h-10 rounded-lg border border-line px-2 text-sm outline-none focus:border-brand-500" value={range.unit} onChange={event => onChange({ ...range, unit: event.target.value })}>
            {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
          </select>
        </div>
      ) : <p className="text-xs text-muted">未启用</p>}
    </div>
  );
}

function ChipEditor({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (values: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState("");
  function add() {
    const value = input.trim();
    if (!value) return;
    onChange([...values, value]);
    setInput("");
  }
  return (
    <div>
      <span className="mb-1 block text-[13px] font-bold text-ink">{label}</span>
      <div className="flex gap-2">
        <input className="h-9 min-w-0 flex-1 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500" value={input} placeholder={placeholder} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); add(); } }} />
        <button type="button" onClick={add} className="h-9 rounded-lg border border-line px-3 text-xs font-bold text-brand-700 hover:border-brand-500">添加</button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {values.map((value, index) => (
          <span key={`${value}-${index}`} className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-ink-soft">
            {value}
            <button type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="text-muted hover:text-red-600" aria-label={`删除 ${value}`}><X size={11} /></button>
          </span>
        ))}
      </div>
    </div>
  );
}

function VariantsEditor({ value, onChange, onRemove }: { value: NonNullable<Variants>; onChange: (value: NonNullable<Variants>) => void; onRemove: () => void }) {
  const [model, setModel] = useState("");
  function addVariant() {
    const name = model.trim();
    if (!name || value.variants.includes(name)) return;
    onChange({ variants: [...value.variants, name], rows: value.rows.map(row => ({ ...row, values: [...row.values, ""] })) });
    setModel("");
  }
  function removeVariant(index: number) {
    onChange({ variants: value.variants.filter((_, i) => i !== index), rows: value.rows.map(row => ({ ...row, values: row.values.filter((_, i) => i !== index) })) });
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input className="h-9 w-48 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500" value={model} placeholder="添加对比型号" onChange={event => setModel(event.target.value)} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); addVariant(); } }} />
        <button type="button" onClick={addVariant} className="h-9 rounded-lg border border-line px-3 text-xs font-bold text-brand-700 hover:border-brand-500">添加型号</button>
        <button type="button" onClick={onRemove} className="ml-auto text-xs font-bold text-red-600 hover:underline">移除型号对比</button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {value.variants.map((variant, index) => (
          <span key={variant} className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            {variant}
            <button type="button" onClick={() => removeVariant(index)} className="text-brand-700/60 hover:text-red-600" aria-label={`删除 ${variant}`}><X size={11} /></button>
          </span>
        ))}
      </div>
      <div className="space-y-2 overflow-x-auto">
        {value.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid min-w-[500px] items-center gap-2" style={{ gridTemplateColumns: `160px repeat(${Math.max(1, value.variants.length)}, minmax(90px, 1fr)) 36px` }}>
            <input className="h-9 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500" value={row.param} placeholder="参数名" onChange={event => { const rows = [...value.rows]; rows[rowIndex] = { ...row, param: event.target.value }; onChange({ ...value, rows }); }} />
            {value.variants.map((_, valueIndex) => (
              <input key={valueIndex} className="h-9 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500" value={row.values[valueIndex] ?? ""} onChange={event => { const rows = [...value.rows]; const values = [...row.values]; values[valueIndex] = event.target.value; rows[rowIndex] = { ...row, values }; onChange({ ...value, rows }); }} />
            ))}
            <button type="button" onClick={() => onChange({ ...value, rows: value.rows.filter((_, i) => i !== rowIndex) })} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:border-red-300 hover:text-red-600" aria-label="删除行"><Trash2 size={14} /></button>
          </div>
        ))}
        <button type="button" onClick={() => onChange({ ...value, rows: [...value.rows, { param: "", values: value.variants.map(() => "") }] })} className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"><Plus size={13} /> 添加参数行</button>
      </div>
    </div>
  );
}
