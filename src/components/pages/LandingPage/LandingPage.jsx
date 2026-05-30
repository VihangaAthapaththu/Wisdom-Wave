import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Code2, Smartphone, Network, BookOpen, Compass, Award, GraduationCap, ArrowRight, Play, ChevronRight } from 'lucide-react';
import { Button, Card } from '@/components';

export function LandingPage() {
  const courses = [
    {
      id: 1,
      title: 'Introduction to Python',
      duration: '4 weeks',
      students: '1.2K students',
      level: 'Beginner',
      icon: Code2,
    },
    {
      id: 2,
      title: 'React Native',
      duration: '6 weeks',
      students: '2.5K students',
      level: 'Intermediate',
      icon: Smartphone,
    },
    {
      id: 3,
      title: 'Networking with Java',
      duration: '8 weeks',
      students: '3.1K students',
      level: 'Advanced',
      icon: Network,
    },
  ];

  const whyItems = [
    { icon: BookOpen, title: 'Best Quality Contents', desc: 'Progressive levels from beginner to expert with hands-on tutorials and real projects.' },
    { icon: Compass, title: 'IT Career Guidance', desc: 'Get career-ready with expert mentorship and real-world job preparation strategies.' },
    { icon: Award, title: 'Valuable Certificate', desc: 'Earn industry-recognized certifications to showcase your skills to employers.' },
    { icon: GraduationCap, title: 'Expert Academics', desc: 'Learn from qualified academic staff with deep industry experience and expertise.' },
  ];

  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-600/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Learning the world's greatest
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 leading-[1.15] mb-6 tracking-tight">
                Build Your IT Career
                <span className="block text-primary mt-1">with Wisdom Wave</span>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                Build real-world IT skills, learn from industry experts, and get career-ready with hands-on projects. Start your journey toward becoming an IT professional.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary text-white px-7 py-3 rounded-xl font-semibold text-base shadow-lg shadow-[rgba(255,165,0,0.20)] hover:shadow-xl hover:shadow-[rgba(255,165,0,0.30)] transition-all duration-300 h-auto active:scale-[0.97] flex items-center gap-2">
                  Start Learning
                  <ArrowRight size={18} />
                </Button>
                <Button variant="outline" className="border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary px-7 py-3 rounded-xl font-semibold text-base transition-all duration-300 h-auto bg-white flex items-center gap-2">
                  <Play size={16} className="fill-current" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-primary-600/10 rounded-[2rem] blur-2xl" />
                <img
                  src="/logo.png"
                  alt="Wisdom Wave"
                  className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-contain rounded-3xl shadow-2xl shadow-black/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="bg-gray-50/70 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Why <span className="text-primary">Wisdom Wave</span>?
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary-600 mx-auto rounded-full mb-5" />
            <p className="text-gray-500 text-base leading-relaxed">
              Everything you need to launch and accelerate your IT career, all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {whyItems.map((item, i) => (
              <Card key={i} className="group bg-white rounded-2xl p-6 text-left border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-[rgba(255,165,0,0.05)] hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary-600/10 flex items-center justify-center mb-4 group-hover:from-primary/25 group-hover:to-primary-600/15 transition-colors duration-300">
                  <item.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed m-0">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Featured <span className="text-primary">Courses</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary-600 mx-auto rounded-full mb-5" />
            <p className="text-gray-500 text-base leading-relaxed">
              Curated by experts, built for real-world skills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {courses.map((course) => {
              const IconComp = course.icon;
              return (
                <Card key={course.id} className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[rgba(255,165,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {course.level}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary-600/10 flex items-center justify-center mb-5 group-hover:from-primary/25 group-hover:to-primary-600/15 transition-colors duration-300">
                    <IconComp size={26} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{course.title}</h3>
                  <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-primary" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-primary" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary text-white py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-[rgba(255,165,0,0.15)] hover:shadow-lg hover:shadow-[rgba(255,165,0,0.25)] transition-all duration-300 h-auto active:scale-[0.97]">
                    Enroll Now
                  </Button>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link to="/courses" className="inline-flex items-center gap-1.5 text-primary hover:text-primary-700 text-base font-semibold transition-colors group">
              Show all Courses
              <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Ready to Start Your IT Journey?</h2>
            <p className="text-gray-500 text-lg mb-8">
              Join thousands of students learning IT development with Wisdom Wave.
            </p>
            <Button className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary text-white px-8 py-3.5 rounded-xl font-semibold text-base shadow-lg shadow-[rgba(255,165,0,0.20)] hover:shadow-xl hover:shadow-[rgba(255,165,0,0.30)] transition-all duration-300 h-auto active:scale-[0.97] inline-flex items-center gap-2">
              Create Free Account
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="Wisdom Wave" className="w-8 h-8 rounded-lg object-contain" />
                <span className="text-white font-bold text-lg">Wisdom Wave</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                Empowering the next generation of IT innovators through world-class education.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2.5">
                <li><Link to="/" className="text-sm text-gray-500 hover:text-primary transition-colors">Learning</Link></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Blog Platform</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Access</h4>
              <ul className="space-y-2.5">
                <li><Link to="/signin" className="text-sm text-gray-500 hover:text-primary transition-colors">Student Login</Link></li>
                <li><Link to="/signin" className="text-sm text-gray-500 hover:text-primary transition-colors">Admin Portal</Link></li>
                <li><Link to="/contact" className="text-sm text-gray-500 hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div className="flex sm:justify-start lg:justify-end items-start">
              <img src="/logo.png" alt="Wisdom Wave" className="w-20 h-20 rounded-2xl object-contain opacity-60" />
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-xs text-gray-600">&copy; 2026 Wisdom Wave. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
