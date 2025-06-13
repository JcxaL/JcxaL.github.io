import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Projects | JccL',
  description: 'Explore projects and work by JccL',
};

const projects = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'A modern personal website built with Next.js, TypeScript, and Tailwind CSS.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    status: 'In Progress',
    link: '#'
  },
  {
    id: 2,
    title: 'Web Application',
    description: 'A full-stack web application with user authentication and real-time features.',
    tech: ['React', 'Node.js', 'MongoDB'],
    status: 'Completed',
    link: '#'
  },
  {
    id: 3,
    title: 'Open Source Tool',
    description: 'A developer tool to improve productivity and workflow automation.',
    tech: ['Python', 'CLI', 'GitHub Actions'],
    status: 'Planned',
    link: '#'
  }
];

export default function Projects() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">Projects</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A collection of my work and personal projects
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {project.description}
                </p>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  project.status === 'Completed' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : project.status === 'In Progress'
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}>
                  {project.status}
                </span>
                
                {project.link !== '#' && (
                  <a
                    href={project.link}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project →
                  </a>
                )}
              </div>
            </div>
          ))}
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