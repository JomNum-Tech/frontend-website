import { Metadata } from 'next';
import CommunityHero from '@/components/community/CommunityHero';

export const metadata: Metadata = {
  title: 'Community | JomNum-Tech',
  description: 'Join our vibrant Telegram community of developers. Connect, learn, and grow with fellow programmers from around the world.',
  keywords: [
    'JomNum-Tech Community',
    'Telegram Group',
    'Developer Community',
    'Programming Community',
    'Coding Help',
    'Tech Discussion',
    'Cambodia Developers'
  ],
  openGraph: {
    title: 'Community | JomNum-Tech',
    description: 'Join our vibrant Telegram community of developers. Connect, learn, and grow with fellow programmers.',
    url: 'https://jomnumtech.naktech.pro/community',
    siteName: 'JomNum-Tech',
    images: [
      {
        url: 'https://7zg3rv0nfdklwx5q.public.blob.vercel-storage.com/jomnum-tech/Screenshot%202025-07-15%20214359.png',
        width: 1200,
        height: 630,
        alt: 'JomNum-Tech Community'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community | JomNum-Tech',
    description: 'Join our vibrant Telegram community of developers. Connect, learn, and grow with fellow programmers.',
    images: [
      'https://7zg3rv0nfdklwx5q.public.blob.vercel-storage.com/jomnum-tech/Screenshot%202025-07-15%20214359.png'
    ],
    creator: '@jomnumtech'
  }
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHero />
      
      {/* Additional Community Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Why Join Our Community?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Help</h3>
                <p className="text-gray-600">
                  Get instant help with coding problems from experienced developers and mentors.
                </p>
              </div>
              
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Project Showcase</h3>
                <p className="text-gray-600">
                  Share your projects, get feedback, and discover amazing work from other developers.
                </p>
              </div>
              
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Job Opportunities</h3>
                <p className="text-gray-600">
                  Discover job opportunities, freelance projects, and networking opportunities.
                </p>
              </div>
              
              <div className="p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Learning Resources</h3>
                <p className="text-gray-600">
                  Access curated learning materials, tutorials, and coding challenges.
                </p>
              </div>
              
              <div className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Events & Workshops</h3>
                <p className="text-gray-600">
                  Join exclusive workshops, coding sessions, and community events.
                </p>
              </div>
              
              <div className="p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
                <p className="text-gray-600">
                  Find collaborators for your projects and join exciting open-source initiatives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}