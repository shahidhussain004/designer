export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-600 mb-4">
            Designer Marketplace
          </h1>
          <p className="text-xl text-gray-600">
            Find talented freelancers for your next project
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-3">Post a Job</h2>
            <p className="text-gray-600 mb-4">
              Describe your project and find the perfect freelancer
            </p>
            <button className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition">
              Get Started
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-3">Browse Talent</h2>
            <p className="text-gray-600 mb-4">
              Explore profiles of skilled designers and developers
            </p>
            <button className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition">
              Find Talent
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-3">Find Work</h2>
            <p className="text-gray-600 mb-4">
              Browse available jobs and submit proposals
            </p>
            <button className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition">
              View Jobs
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-4">How it Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1</div>
              <h4 className="text-lg font-semibold mb-2">Post Your Project</h4>
              <p className="text-gray-600">Describe what you need and set your budget</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">2</div>
              <h4 className="text-lg font-semibold mb-2">Review Proposals</h4>
              <p className="text-gray-600">Get bids from qualified freelancers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">3</div>
              <h4 className="text-lg font-semibold mb-2">Hire & Pay Securely</h4>
              <p className="text-gray-600">Work together and release payment when done</p>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500">
          <p>© 2025 Designer Marketplace. Phase 1 - MVP Development</p>
        </footer>
      </div>
    </main>
  )
}
