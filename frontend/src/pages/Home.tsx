import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiUploadCloud,
  FiZap,
  FiRefreshCw,
  FiDownload,
  FiArrowRight,
  FiBarChart,
  FiShield,
} from 'react-icons/fi';

// Hero Section Component
const HeroSection: React.FC = () => (
  <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
    <div className="text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
        <span className="text-blue-600">PLAQUE</span>
      </h1>
      <p className="text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Detect AI-Generated Content & Plagiarism, Then Humanize Your Work
      </p>
      <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
        Advanced plagiarism detection and AI content humanization in seconds.
        Keep your academic integrity while making your writing more natural.
      </p>

      <Link
        to="/register"
        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 text-lg font-semibold transition"
      >
        <span>Get Started Free</span>
        <FiArrowRight />
      </Link>
    </div>
  </section>
);

// Features Section Component
const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 'upload',
      icon: <FiUploadCloud className="w-16 h-16 text-blue-600 mb-4" />,
      title: "Easy Upload",
      description: "Upload PDF, DOC, or DOCX files. Drag and drop for convenience."
    },
    {
      id: 'detection',
      icon: <FiZap className="w-16 h-16 text-purple-600 mb-4" />,
      title: "Smart Detection",
      description: "Advanced AI and plagiarism detection with detailed analysis."
    },
    {
      id: 'humanization',
      icon: <FiRefreshCw className="w-16 h-16 text-orange-500 mb-4" />,
      title: "Humanization Engine",
      description: "Rewrite content in multiple academic styles - formal, simplified, scholarly."
    },
    {
      id: 'export',
      icon: <FiDownload className="w-16 h-16 text-green-600 mb-4" />,
      title: "Export Results",
      description: "Download your humanized content as PDF or DOCX with formatting preserved."
    },
    {
      id: 'reports',
      icon: <FiBarChart className="w-16 h-16 text-yellow-600 mb-4" />,
      title: "Detailed Reports",
      description: "Get comprehensive analysis with AI scores and plagiarism percentages."
    },
    {
      id: 'security',
      icon: <FiShield className="w-16 h-16 text-gray-600 mb-4" />,
      title: "Secure & Private",
      description: "Your documents are encrypted and never shared with third parties."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
        Powerful Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div key={feature.id} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            {feature.icon}
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

// How It Works Section Component
const HowItWorksSection: React.FC = () => {
  const steps = [
    { id: 'upload', number: 1, title: "Upload", description: "Upload your research paper or document" },
    { id: 'analyze', number: 2, title: "Analyze", description: "Detect AI content and plagiarism instantly" },
    { id: 'humanize', number: 3, title: "Humanize", description: "Rewrite with your chosen academic style" },
    { id: 'export', number: 4, title: "Export", description: "Download your improved document" }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
        How It Works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step) => (
          <div key={step.id} className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">{step.number}</div>
            <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection: React.FC = () => (
  <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
    <h2 className="text-4xl font-bold text-gray-900 mb-8">
      Ready to Get Started?
    </h2>
    <p className="text-xl text-gray-600 mb-12">
      Join thousands of students and academics using PLAQUE
    </p>
    <Link
      to="/register"
      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-10 py-4 rounded-lg hover:bg-blue-700 text-lg font-semibold transition"
    >
      <span>Sign Up Now</span>
      <FiArrowRight />
    </Link>
  </section>
);

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
};

export default Home;