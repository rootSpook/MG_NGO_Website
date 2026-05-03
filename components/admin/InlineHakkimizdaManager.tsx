"use client";

import {
  TeamMembersEditor,
  type TeamMemberEntry,
  makeTeamMemberId,
} from "@/components/admin/shared/TeamMembersEditor";
import {
  ContentImagesEditor,
  type ContentImageEntry,
  makeContentImageId,
} from "@/components/admin/shared/ContentImagesEditor";
import { ImageUploadField } from "@/components/admin/shared/ImageUploadField";

interface InlineHakkimizdaManagerProps {
  heroImage: string;
  onHeroImageChange: (url: string) => void;
  team: TeamMemberEntry[];
  onTeamChange: (next: TeamMemberEntry[]) => void;
  contentImages: ContentImageEntry[];
  onContentImagesChange: (next: ContentImageEntry[]) => void;
}

/**
 * Editor card for the Hakkımızda page: hero image + content gallery + team
 * members with photo upload.
 */
export function InlineHakkimizdaManager({
  heroImage,
  onHeroImageChange,
  team,
  onTeamChange,
  contentImages,
  onContentImagesChange,
}: InlineHakkimizdaManagerProps) {
  const normalizedTeam: TeamMemberEntry[] = team.map((m) => ({
    id: m.id || makeTeamMemberId(),
    name: m.name ?? "",
    description: m.description ?? "",
    photoUrl: m.photoUrl ?? "",
  }));

  const normalizedImages: ContentImageEntry[] = contentImages.map((img) => ({
    id: img.id || makeContentImageId(),
    url: img.url ?? "",
    caption: img.caption ?? "",
  }));

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Hakkımızda Görselleri
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Sayfanın üst kısmındaki tanıtım görseli, sayfa içeriğine eklenecek görseller
          ve ekip üyelerinin fotoğrafları buradan yönetilir.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ImageUploadField
          label="Hero / Tanıtım Görseli"
          value={heroImage}
          onChange={onHeroImageChange}
          aspectClassName="aspect-[16/9]"
          hint="İsteğe bağlı. Sayfanın üst tarafında gösterilir."
        />
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500">
          <p className="font-semibold text-gray-700">İpucu</p>
          <p className="mt-1 leading-relaxed">
            Eklediğiniz görseller; vizyon/misyon paragraflarının altında galeri olarak
            gösterilir. Ekip üyelerinin fotoğrafları "Ekibimiz" listesinde kart üzerinde
            görünür.
          </p>
        </div>
      </div>

      <ContentImagesEditor
        label="İçerik Görselleri"
        hint="Sayfa metinlerinin altında gösterilecek galeriyi yönetin."
        items={normalizedImages}
        onChange={onContentImagesChange}
      />

      <TeamMembersEditor items={normalizedTeam} onChange={onTeamChange} />
    </div>
  );
}
