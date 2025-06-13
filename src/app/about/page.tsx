import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | JccL',
  description: 'Learn more about JccL - software developer and technology enthusiast',
};

export default function About() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">About Me</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Software developer and technology enthusiast
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Welcome! I&apos;m JccL, a passionate software developer with a love for creating 
              innovative solutions and exploring new technologies. This website serves as 
              my digital portfolio and a place to share my thoughts on technology and development.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Skills & Technologies</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                'TypeScript', 'React', 'Next.js', 'Node.js', 
                'Python', 'Tailwind CSS', 'Git', 'Docker'
              ].map((skill) => (
                <div key={skill} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <span className="font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Experience</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              I have experience working with modern web technologies, building scalable 
              applications, and contributing to open-source projects. I enjoy tackling 
              complex problems and learning new technologies along the way.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
} 