import type { Metadata } from "next";
import { api } from "@/lib/api";
import { CategoryCard } from "@/components/storefront/category-card";
import { Reveal } from "@/components/ui/reveal";
import { getServerTranslation } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kategori",
  description: "Jelajahi aplikasi dan akun premium SerbaPremium berdasarkan kategori pilihan.",
};

export default async function KategoriIndexPage() {
  const { lang, t } = await getServerTranslation();
  const rawCats = api.categories.withCount().filter((c) => c.count > 0);
  const cats = rawCats.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    count: c.count,
  }));

  return (
    <div className="tk-container pt-28 pb-20">
      <header className="mb-10 border-b border-border/70 pb-6">
        <span className="rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold uppercase text-accent">
          {lang === "en" ? "DIRECTORY" : lang === "zh" ? "分类索引" : "DIREKTORI"}
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          {lang === "en" ? "Application Categories" : lang === "zh" ? "全部分类与产品" : "Kategori Aplikasi"}
        </h1>
        <p className="mt-2 max-w-xl text-[15px] font-normal leading-relaxed text-fg-muted">
          {lang === "en"
            ? "Choose a category matching your creative workflows, productivity goals, or digital entertainment."
            : lang === "zh"
            ? "根据您的日常工作流、AI 生产力或数字娱乐需求选择对应的专属分类。"
            : "Pilih kategori yang sesuai dengan alur kerja, produktivitas, atau hiburan Anda."}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cats.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.03}>
            <CategoryCard category={{ id: c.id, slug: c.slug, name: c.name, description: c.description }} count={c.count} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
