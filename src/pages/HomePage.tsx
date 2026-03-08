  import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Heart, Award, Target } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url("/ngoprofile.jpg")'
        }}
      >
        <div className="text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Empowering Lives.<br />
            <span className="text-orange-400">Inspiring Hope.</span><br />
            Building a Better Tomorrow.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            VOICE OF NATION FOUNDATION uplifts marginalized communities in Bangalore through compassion, relief, and sustainable change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/get-involved"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Join Us</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/get-involved"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Donate Now
            </Link>
            <Link
              to="/impact"
              className="bg-transparent border-2 border-orange-400 hover:bg-orange-400 text-orange-400 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Our Impact
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: '5,000+', label: 'Lives Impacted' },
              { icon: Heart, number: '30+', label: 'Communities Served' },
              { icon: Award, number: '50+', label: 'Programs Completed' },
              { icon: Target, number: '4', label: 'Years of Service' },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors duration-300">
                  <stat.icon className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our mission is to improve the well-being of the underprivileged sections of Bangalore through relief initiatives, empowerment programs, and by spreading courage and positivity.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                We envision a united and equitable society where every individual has the opportunity to thrive with dignity and hope.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Community work"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-orange-600">Since 2020</div>
                <div className="text-gray-600">Making a difference</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive programs address the root causes of inequality and provide sustainable solutions for lasting change.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Food & Nutrition Drives',
                description: 'Providing nutritious meals to slum and shelter homes.',
                image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
              },
              {
                title: 'Women Empowerment',
                description: 'Skill development and self-help training for marginalized women.',
                image: 'https://images.pexels.com/photos/8471996/pexels-photo-8471996.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
              },
              {
                title: 'Youth Education Support',
                description: 'Scholarships, mentorship, and school supplies for students.',
                image: 'https://images.pexels.com/photos/8471844/pexels-photo-8471844.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
              },
            ].map((program, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{program.title}</h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/programs"
              className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              View All Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join us in our mission to create positive change in communities across Bangalore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/get-involved"
              className="bg-white hover:bg-gray-100 text-orange-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Involved Today
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;