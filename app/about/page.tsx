import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getAboutPageData } from "@/lib/publicPagesContent"

export default async function AboutUsPage() {
  const aboutContent = await getAboutPageData()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero image (optional) */}
        {aboutContent.heroImage && (
          <section className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto pt-8">
            <img
              src={aboutContent.heroImage}
              alt={aboutContent.title}
              className="w-full rounded-2xl object-cover h-56 md:h-80 lg:h-96"
            />
          </section>
        )}

        {/* About Us Section */}
        <section className="py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--theme-title-text,var(--primary))] mb-6">{aboutContent.title}</h1>
              <p className="text-gray-700 leading-relaxed">
                {aboutContent.intro}
              </p>
            </div>
            <div className="flex-shrink-0">
              <svg
                width="200"
                height="280"
                viewBox="0 0 200 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-40 md:w-48 lg:w-52"
              >
                {/* Teal Awareness Ribbon */}
                <path
                  d="M100 0C100 0 60 60 60 100C60 140 80 160 100 200C120 160 140 140 140 100C140 60 100 0 100 0Z"
                  fill="currentColor" className="text-primary"
                />
                <path
                  d="M100 200C80 220 40 260 30 280C50 270 80 250 100 240C120 250 150 270 170 280C160 260 120 220 100 200Z"
                  fill="currentColor" className="text-primary"
                />
                <path
                  d="M85 80C85 80 75 100 80 120C85 140 95 150 100 160"
                  stroke="currentColor" className="text-primary opacity-50"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--theme-title-text,var(--primary))] mb-4">Vizyon</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
            {aboutContent.vision.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Mission Section */}
        <section className="py-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--theme-title-text,var(--primary))] mb-4">Misyon</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
            {aboutContent.mission.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Content images gallery (optional) */}
        {aboutContent.contentImages && aboutContent.contentImages.length > 0 && (
          <section className="py-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {aboutContent.contentImages.map((img) => (
                <figure
                  key={img.id}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
                >
                  <img
                    src={img.url}
                    alt={img.caption || "Görsel"}
                    className="h-48 w-full object-cover"
                  />
                  {img.caption && (
                    <figcaption className="px-4 py-3 text-sm text-gray-600">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Meet Our Team Section */}
        <section className="py-8 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--theme-title-text,var(--primary))] mb-6">Ekibimiz</h2>

          <ul className="space-y-8">
            {aboutContent.team.map((member, idx) => (
              <li key={member.name + idx} className="flex gap-6 items-start">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 60 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="30" cy="22" r="12" fill="#9CA3AF" />
                        <path
                          d="M10 55C10 42 18 35 30 35C42 35 50 42 50 55"
                          fill="#9CA3AF"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-2">• {member.name}</p>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {member.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}
