'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Users, ExternalLink, Zap } from 'lucide-react';

export default function CommunityHero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <Users className="w-12 h-12" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Join Our <span className="text-yellow-300">Community</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Connect with fellow learners, share knowledge, and grow together in our vibrant learning community
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-3 text-lg"
              onClick={() => window.open('https://t.me/jomnumtech', '_blank')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Join Our Telegram
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold text-lg mb-2">Active Learning</h3>
                <p className="text-blue-100 text-sm">
                  Engage with courses, complete projects, and track your learning progress
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold text-lg mb-2">Growing Community</h3>
                <p className="text-blue-100 text-sm">
                  Connect with fellow learners and experienced developers
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
                <p className="text-blue-100 text-sm">
                  Get help from instructors and experienced community members
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}