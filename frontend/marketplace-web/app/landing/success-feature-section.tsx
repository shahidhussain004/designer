import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const SuccessFeaturesSection = () => {
  const features = [
    {
      id: 1,
      title: "Post a Job",
      description: "Describe your project and find the perfect freelancer. Set your budget, timeline, and requirements to attract the best talent.",
      imageUrl: "/post-job.png",
      icon: (
        <svg className="w-14 h-14" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="25" width="40" height="45" rx="3" stroke="#1A2332" strokeWidth="2.5"/>
          <path d="M28 25V20C28 18.3431 29.3431 17 31 17H49C50.6569 17 52 18.3431 52 20V25" stroke="#1A2332" strokeWidth="2.5"/>
          <circle cx="40" cy="45" r="8" stroke="#E74C3C" strokeWidth="2.5"/>
          <path d="M40 41V45L43 48" stroke="#E74C3C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      imagePlaceholder: (
        <div className="w-full h-full bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
              <rect x="80" y="60" width="240" height="180" rx="8" fill="#E74C3C" opacity="0.3"/>
              <rect x="120" y="100" width="160" height="100" rx="4" fill="#1A2332" opacity="0.2"/>
              <circle cx="200" cy="150" r="30" fill="#E74C3C" opacity="0.4"/>
            </svg>
          </div>
          <div className="text-center z-10 p-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white/50 backdrop-blur flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                <rect x="10" y="14" width="28" height="24" rx="2" stroke="#E74C3C" strokeWidth="2"/>
                <path d="M16 14V11C16 10.4477 16.4477 10 17 10H31C31.5523 10 32 10.4477 32 11V14" stroke="#E74C3C" strokeWidth="2"/>
                <circle cx="24" cy="26" r="5" stroke="#1A2332" strokeWidth="2"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">Project Briefcase</p>
          </div>
        </div>
      ),
      gradient: "from-red-50/50 to-orange-50/50"
    },
    {
      id: 2,
      title: "Browse Talent",
      description: "Explore profiles of skilled designers and developers. Review portfolios, ratings, and expertise to find your ideal match.",
      imageUrl: "/browse-talent.png",
      icon: (
        <svg className="w-14 h-14" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="35" cy="35" r="15" stroke="#1A2332" strokeWidth="2.5"/>
          <path d="M46 46L58 58" stroke="#E74C3C" strokeWidth="3.5" strokeLinecap="round"/>
          <circle cx="35" cy="32" r="5" stroke="#E74C3C" strokeWidth="2"/>
        </svg>
      ),
      imagePlaceholder: (
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
              <circle cx="120" cy="120" r="40" fill="#1A2332" opacity="0.2"/>
              <circle cx="200" cy="150" r="50" fill="#E74C3C" opacity="0.3"/>
              <circle cx="280" cy="120" r="40" fill="#1A2332" opacity="0.2"/>
            </svg>
          </div>
          <div className="text-center z-10 p-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white/50 backdrop-blur flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="18" r="8" stroke="#E74C3C" strokeWidth="2"/>
                <path d="M12 38C12 32 16 28 24 28C32 28 36 32 36 38" stroke="#1A2332" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">Talent Profiles</p>
          </div>
        </div>
      ),
      gradient: "from-blue-50/50 to-indigo-50/50"
    },
    {
      id: 3,
      title: "Find Work",
      description: "Browse available jobs and submit proposals. Showcase your skills and win projects that match your expertise.",
      imageUrl: "/find-work.png",
      icon: (
        <svg className="w-14 h-14" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="22" y="20" width="36" height="45" rx="3" stroke="#1A2332" strokeWidth="2.5"/>
          <circle cx="40" cy="35" r="8" stroke="#E74C3C" strokeWidth="2.5"/>
          <path d="M36 35L39 38L45 32" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      imagePlaceholder: (
        <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
              <rect x="80" y="80" width="240" height="140" rx="8" fill="#1A2332" opacity="0.2"/>
              <circle cx="200" cy="150" r="40" fill="#10B981" opacity="0.3"/>
            </svg>
          </div>
          <div className="text-center z-10 p-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white/50 backdrop-blur flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                <rect x="10" y="10" width="28" height="28" rx="2" stroke="#1A2332" strokeWidth="2"/>
                <circle cx="24" cy="24" r="8" stroke="#10B981" strokeWidth="2"/>
                <path d="M20 24L23 27L29 21" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">Job Opportunities</p>
          </div>
        </div>
      ),
      gradient: "from-green-50/50 to-emerald-50/50"
    },
    {
      id: 4,
      title: "Learn Skills",
      description: "Take courses from industry experts. Enhance your capabilities and stay ahead with cutting-edge knowledge.",
      imageUrl: "/learn-skills.png",
      icon: (
        <svg className="w-14 h-14" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 20L60 30V50L40 60L20 50V30L40 20Z" stroke="#1A2332" strokeWidth="2.5" strokeLinejoin="round"/>
          <path d="M20 30L40 40L60 30" stroke="#E74C3C" strokeWidth="2.5" strokeLinejoin="round"/>
        </svg>
      ),
      imagePlaceholder: (
        <div className="w-full h-full bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
              <path d="M100 150L200 100L300 150V230L200 280L100 230V150Z" fill="#F59E0B" opacity="0.2"/>
              <rect x="150" y="140" width="100" height="80" rx="4" fill="#1A2332" opacity="0.2"/>
            </svg>
          </div>
          <div className="text-center z-10 p-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white/50 backdrop-blur flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                <path d="M24 10L36 16V28L24 34L12 28V16L24 10Z" stroke="#F59E0B" strokeWidth="2"/>
                <path d="M12 16L24 22L36 16" stroke="#F59E0B" strokeWidth="2"/>
                <circle cx="24" cy="22" r="4" stroke="#1A2332" strokeWidth="2"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">Learning Hub</p>
          </div>
        </div>
      ),
      gradient: "from-amber-50/50 to-yellow-50/50"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-slate-100 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-normal text-gray-900 mb-6 tracking-tight">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Whether you&apos;re hiring or looking for work, we&apos;ve got you covered
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`group relative ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
            >
              {/* Card with horizontal layout */}
              <div className={`relative bg-white rounded-3xl p-8 lg:p-16 transition-all duration-500 hover:shadow-2xl border border-gray-200 overflow-hidden`}>
                <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                  {/* Left Content */}
                  <div className="flex-1 space-y-6">
                    {/* Icon */}
                    <div>
                      {feature.icon}
                    </div>

                    {/* Text Content */}
                    <div className="space-y-4">
                      <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg max-w-xl">
                        {feature.description}
                      </p>

                      {/* CTA */}
                      <button className="inline-flex items-center gap-3 text-red-600 font-semibold text-lg group/btn transition-all duration-300 hover:gap-5 pt-2">
                        Get Started
                        <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover/btn:translate-x-2" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="w-full lg:w-[420px] h-[320px] flex-shrink-0">
                    <div className="relative w-full h-full">
                      {/* Outer white border with shadow - rotated */}
                      <div className="absolute inset-0 rounded-3xl bg-white p-2 shadow-xl transition-transform duration-500 group-hover:scale-105 rotate-[8deg] group-hover:rotate-[5deg]">
                        {/* Inner red border - slightly less rotated for depth */}
                        <div className="w-full h-full rounded-2xl border-[5px] border-red-500 overflow-hidden -rotate-[4deg]">
                          {/* Image container - counter-rotate to make image straight */}
                          <div className="w-full h-full rotate-[4deg] scale-110">
                            {/* Image or Placeholder */}
                            {feature.imageUrl ? (
                              <Image 
                                src={feature.imageUrl} 
                                alt={feature.title}
                                className="w-full h-full object-cover"
                                width={450}
                                height={320}
                              />
                            ) : (
                              feature.imagePlaceholder
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative gradient background */}
                <div className={`absolute -top-20 ${index % 2 === 0 ? '-right-20' : '-left-20'} w-64 h-64 bg-gradient-to-br ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-gray-50 via-white to-red-50 rounded-full px-10 py-5 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <span className="text-gray-700 font-semibold text-lg">Ready to get started?</span>
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl text-lg" onClick={() => window.location.href = '/auth/register'}>
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessFeaturesSection;