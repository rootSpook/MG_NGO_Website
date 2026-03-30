import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* About Us Section */}
        <section className="py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-teal-600 mb-6">About Us</h1>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum placerat dolor sit
                amet orci imperdiet, vitae laoreet mi vulputate. Nulla pulvinar ultricies odio quis
                tincidunt. Aenean id fermentum urna. Morbi et lacinia neque. Sed venenatis hendrerit
                quam. Nulla bibendum sed enim in sodales. Nullam cursus tellus eget lorem molestie,
                elementum tristique magna dignissim. Cras dictum sapien at mi consequat mollis.
                Vivamus a tristique mi. Vivamus id ante aliquam, gravida lorem nec, vehicula augue.
                Integer ac bibendum purus. Fusce vel purus vel erat fringilla mattis. Aenean gravida,
                quam non pretium facilisis, nunc erat dictum tortor, sit amet euismod nisi nisl aliquam
                purus. Vestibulum convallis, arcu eu condimentum vulputate, odio metus pretium
                sem, id cursus ipsum mauris at massa.
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
                  fill="#0D9488"
                />
                <path
                  d="M100 200C80 220 40 260 30 280C50 270 80 250 100 240C120 250 150 270 170 280C160 260 120 220 100 200Z"
                  fill="#0D9488"
                />
                <path
                  d="M85 80C85 80 75 100 80 120C85 140 95 150 100 160"
                  stroke="#0A7A72"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-600 mb-4">Vision</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
            <li>Quisque finibus lacus in diam vestibulum, vitae aliquam tortor aliquet.</li>
            <li>Ut placerat neque at vulputate mollis.</li>
          </ul>
        </section>

        {/* Mission Section */}
        <section className="py-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-600 mb-4">Mission</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Nullam accumsan ex sit amet varius placerat.</li>
            <li>Nulla dapibus ex sed nunc scelerisque dictum.</li>
            <li>Nunc sed nisl posuere, eleifend nibh id, auctor augue.</li>
          </ul>
        </section>

        {/* Meet Our Team Section */}
        <section className="py-8 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-600 mb-6">Meet Our Team</h2>

          <ul className="space-y-8">
            {/* Person 1 */}
            <li className="flex gap-6 items-start">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
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
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">• Person1</p>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum placerat dolor sit amet orci imperdiet,
                  vitae laoreet mi vulputate. Nulla pulvinar ultricies odio quis tincidunt. Aenean id fermentum urna. Morbi et
                  lacinia neque. Sed venenatis hendrerit quam. Nulla bibendum sed enim in sodales. Nullam cursus tellus
                  eget lorem molestie, elementum tristique magna dignissim. Cras dictum sapien at mi consequat mollis.
                  Vivamus a tristique mi. Vivamus id ante aliquam, gravida lorem nec, vehicula augue. Integer ac bibendum
                  purus. Fusce vel purus vel erat fringilla mattis.
                </p>
              </div>
            </li>

            {/* Person 2 */}
            <li className="flex gap-6 items-start">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
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
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">• Person2</p>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum placerat dolor sit amet orci imperdiet,
                  vitae laoreet mi vulputate. Nulla pulvinar ultricies odio quis tincidunt. Aenean id fermentum urna. Morbi et
                  lacinia neque. Sed venenatis hendrerit quam. Nulla bibendum sed enim in sodales. Nullam cursus tellus
                  eget lorem molestie, elementum tristique magna dignissim. Cras dictum sapien at mi consequat mollis.
                  Vivamus a tristique mi. Vivamus id ante aliquam, gravida lorem nec, vehicula augue. Integer ac bibendum
                  purus. Fusce vel purus vel erat fringilla mattis.
                </p>
              </div>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}
