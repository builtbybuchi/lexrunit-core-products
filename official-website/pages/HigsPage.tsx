import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { getHigsEvent } from '../lib/dataService';
import { Calendar, MonitorPlay, Activity, Stethoscope, Laptop, Network, ArrowRight, BookOpen } from 'lucide-react';

const HigsPage: React.FC = () => {
  const [eventData, setEventData] = useState<{ date: string; registrationUrl: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHigsEvent().then(data => {
      setEventData(data);
      setLoading(false);
    });
  }, []);

  const regUrl = eventData?.registrationUrl || "https://luma.com/oyyhm42g";

  return (
    <div className="font-montserrat">
      {/* SECTION A: HERO AREA */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#021488] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0546B6]/50 to-[#021488]"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Healthcare in the <br /> Global South <span className="text-[#0A91F9]">(HIGS)</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Bridging the dangerous communication gap between technology innovators and medical practitioners.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={regUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#0A91F9] hover:bg-[#C5ECF4] text-white hover:text-[#021488] px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Register for the Next Session
              <ArrowRight className="w-5 h-5" />
            </a>
            {eventData?.date && eventData.date !== 'TBA' && (
              <div className="flex items-center gap-2 text-[#C5ECF4] bg-white/5 backdrop-blur-sm px-6 py-4 rounded-full border border-white/10">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">{eventData.date}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION B: THE PROBLEM (ORIGIN STORY) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-[#C5ECF4]/20 border border-[#0A91F9]/20 rounded-3xl p-8 md:p-16 relative">
            <div className="absolute -top-6 -left-6 text-8xl text-[#0A91F9] opacity-20 font-serif leading-none">"</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#021488] mb-8">The Problem We Are Solving</h2>
            
            <div className="prose prose-lg text-gray-700 font-medium leading-loose">
              <p>
                Techies and health practitioners are building in completely different worlds. 
                <strong className="text-[#0546B6]"> We learned this the hard way.</strong>
              </p>
              <p>
                We spent months building a medical product, consulted with doctors, but at the live hospital demo, 
                it failed because the tech didn't match the chaotic reality of clinic operations. 
              </p>
              <p>
                Everyone wants quality care, but techies are struggling because they are building in the dark. 
                They create elegant solutions for problems that hospitals don't actually have, while real bottlenecks remain ignored.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: THE MISSION & THE AUDIENCE (BENTO GRID) */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20 max-w-6xl mx-auto">
            <div className="md:w-1/2">
              <img 
                src="https://res.cloudinary.com/dlvffw5wt/image/upload/v1782393750/33b8cd75-3f9b-47d9-8227-a35bdd762ec5.png" 
                alt="HIGS Ecosystem connecting Health Practitioners, Medical Students, Patients, and Software Engineers" 
                className="w-full border border-[#0A91F9] shadow-2xl object-cover bg-white"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-sm font-bold uppercase text-[#0A91F9] tracking-widest mb-2">The Solution</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-[#021488] mb-6">Monthly Convergence</h3>
              <p className="text-xl text-gray-600 leading-relaxed mb-4">
                HIGS is a monthly virtual event designed to fix the dangerous disconnect between tech innovators and clinical realities.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                We bring the entire ecosystem together—health practitioners, medical students, patients, and software engineers—to learn, share, and align our efforts so we can finally build tools that matter and save lives.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-[#C5ECF4] rounded-xl flex items-center justify-center text-[#0546B6] mb-6 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#021488] mb-3">Medical Practitioners & Doctors</h3>
              <p className="text-gray-600 leading-relaxed">
                Sharing the unfiltered operational reality of hospitals. Tell builders what you actually need to save lives and save time.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-[#0A91F9]/10 rounded-xl flex items-center justify-center text-[#0A91F9] mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#021488] mb-3">Pharmacists & Supply Chain</h3>
              <p className="text-gray-600 leading-relaxed">
                Highlighting the gaps in medication tracking, inventory management, and the tech needed to secure the medical supply chain.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-[#0546B6]/10 rounded-xl flex items-center justify-center text-[#0546B6] mb-6 group-hover:scale-110 transition-transform">
                <Laptop className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#021488] mb-3">Software Engineers & Founders</h3>
              <p className="text-gray-600 leading-relaxed">
                Learning what hospitals actually need. Stop guessing and start building tools that integrate seamlessly into clinical workflows.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-[#C5ECF4] rounded-xl flex items-center justify-center text-[#0546B6] mb-6 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#021488] mb-3">Medical Students</h3>
              <p className="text-gray-600 leading-relaxed">
                Gaining early exposure to clinical challenges and the future of healthtech, preparing them to lead the next generation of medical innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D: FINAL CTA & REGISTRATION */}
      <section className="py-24 bg-[#021488] relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0546B6] rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A91F9] rounded-full blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8">
            Stop building in the dark.
          </h2>
          <p className="text-xl md:text-2xl text-[#C5ECF4] mb-12 font-medium">
            Learn exactly what you can contribute to providing better medical access in developing countries.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a 
              href={regUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-[#021488] hover:bg-[#C5ECF4] px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:-translate-y-1 flex items-center gap-2"
            >
              Join the Mission (Register Here)
            </a>
            
            <a 
              href="https://canva.link/scj5iywsobcbdl5"
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-transparent border border-white/30 text-white hover:bg-white/10 px-10 py-5 rounded-full font-bold text-lg transition-all flex items-center gap-2"
            >
              Partner With Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HigsPage;
