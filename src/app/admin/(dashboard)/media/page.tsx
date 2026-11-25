import MediaLibrary from "@/components/admin/media-library";

export default function AdminMediaPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-[-0.02em] text-ink">媒体库</h1>
        <p className="mt-1 text-sm text-muted">上传、搜索和复用商品图片。只有已上传的文件可以删除。</p>
      </div>
      <MediaLibrary />
    </div>
  );
}
