import { User } from "lucide-react";
import type { TeamGridBlockData } from "@/types/pageBuilder";
import { getBoardMembers } from "@/lib/firebase/adminServices";

interface TeamGridBlockProps {
  data: Record<string, unknown>;
}

interface DisplayMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
}

export async function TeamGridBlock({ data }: TeamGridBlockProps) {
  const d = data as unknown as TeamGridBlockData;

  let members: DisplayMember[] = [];

  if (d.source === "manual") {
    members = (d.manualMembers ?? []).map((m) => ({
      id: m.id,
      name: m.name,
      title: m.title,
      bio: m.bio,
      photoUrl: m.photoUrl,
    }));
  } else {
    // Pull from the boardMembers Firestore collection. Falls back to an
    // empty list if the read fails so the page still renders.
    try {
      const board = await getBoardMembers();
      members = board.map((member) => ({
        id: member.id,
        name: member.name,
        title: member.title,
        bio: member.bio,
        photoUrl: member.photoUrl,
      }));
    } catch (err) {
      console.error("[TeamGridBlock] failed to load board members:", err);
    }
  }

  if (members.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
          Henüz ekip üyesi eklenmedi.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <div className="grid gap-6 md:grid-cols-3">
        {members.map((m) => (
          <article
            key={m.id}
            className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm"
          >
            {m.photoUrl ? (
              <img
                src={m.photoUrl}
                alt={m.name}
                className="mx-auto h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                <User className="h-10 w-10" />
              </div>
            )}
            <h3 className="mt-3 text-lg font-semibold text-gray-900">{m.name}</h3>
            {m.title && <p className="text-sm text-teal-700">{m.title}</p>}
            {m.bio && <p className="mt-2 text-sm text-gray-600">{m.bio}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
