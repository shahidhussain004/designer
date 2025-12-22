import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-primary-600">
                Designer Marketplace
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</Link>
                <Link href="/courses" className="text-gray-600 hover:text-gray-900">Courses</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">Login</Link>
              <Link 
                href="/auth/register" 
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary-600 mb-4">
              Designer Marketplace
            </h1>
            <p className="text-xl text-gray-600">
              Find talented freelancers for your next project or learn new skills
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Link href="/jobs/new" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold mb-3">Post a Job</h2>
              <p className="text-gray-600 mb-4">
                Describe your project and find the perfect freelancer
              </p>
              <span className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition">
                Get Started
              </span>
            </Link>

            <Link href="/freelancers" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold mb-3">Browse Talent</h2>
              <p className="text-gray-600 mb-4">
                Explore profiles of skilled designers and developers
              </p>
              <span className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition">
                Find Talent
              </span>
            </Link>

            <Link href="/jobs" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold mb-3">Find Work</h2>
              <p className="text-gray-600 mb-4">
                Browse available jobs and submit proposals
              </p>
              <span className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition">
                View Jobs
              </span>
            </Link>

            <Link href="/courses" className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-md p-6 hover:shadow-lg transition text-white">
              <h2 className="text-2xl font-semibold mb-3">Learn Skills</h2>
              <p className="text-white text-opacity-90 mb-4">
                Take courses from industry experts
              </p>
              <span className="inline-block bg-white text-primary-600 px-6 py-2 rounded-md hover:bg-gray-100 transition">
                Browse Courses
              </span>
            </Link>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">How it Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Post Your Project</h4>
              <p className="text-gray-600">Describe what you need and set your budget</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Review Proposals</h4>
              <p className="text-gray-600">Get bids from qualified freelancers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Fund Milestones</h4>
              <p className="text-gray-600">Securely deposit funds into escrow</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Approve & Pay</h4>
              <p className="text-gray-600">Release payment when work is complete</p>
            </div>
          </div>
        </div>

        {/* Featured Courses Section */}
          <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Learn New Skills</h3>
            <Link href="/courses" className="text-primary-600 hover:underline">
              View all courses →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-white text-4xl">🎨</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-primary-600 font-medium">UI/UX Design</p>
                <h4 className="font-semibold mt-1">Master Modern UI Design</h4>
                <p className="text-sm text-gray-500 mt-2">12 lessons • 4h 30m</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-white text-4xl">💻</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-primary-600 font-medium">Web Development</p>
                <h4 className="font-semibold mt-1">React & Next.js Fundamentals</h4>
                <p className="text-sm text-gray-500 mt-2">20 lessons • 8h 15m</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <span className="text-white text-4xl">📱</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-primary-600 font-medium">Mobile Development</p>
                <h4 className="font-semibold mt-1">Build iOS & Android Apps</h4>
                <p className="text-sm text-gray-500 mt-2">18 lessons • 7h 45m</p>
              </div>
            </div>
          </div>
        </div>

          <footer className="mt-12 text-center text-gray-500">
            <p>© 2025 Designer Marketplace. Connecting talent with opportunity.</p>
          </footer>
        </div>
      </div>
    </main>
  )
}
