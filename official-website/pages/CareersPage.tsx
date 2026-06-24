
import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { BriefcaseIcon } from '../components/icons/CareerIcons';
import { getJobs } from '../lib/dataService';
import { Job } from '../types';

const CareersPage: React.FC = () => {
  const [jobOpenings, setJobOpenings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getJobs();
        setJobOpenings(jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div>
      <PageHeader
        title="Join Our Team"
        subtitle="We are building a team of passionate fighters and innovators. Help us shape the future of software."
      />
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-extrabold text-lex-dark-blue mb-12 text-center">Current Openings</h2>
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lex-med-blue"></div>
                </div>
            ) : (
            <div className="space-y-6">
                {jobOpenings.length > 0 ? (
                    jobOpenings.map((job) => (
                        <div key={job.id} className="bg-lex-bg p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex-grow">
                                   <div className="flex items-center mb-2">
                                     <BriefcaseIcon />
                                     <h3 className="text-xl font-bold text-lex-dark-blue ml-3">{job.title}</h3>
                                   </div>
                                   <div className="flex flex-wrap gap-2 mb-3 sm:ml-9">
                                       <span className="text-gray-500 font-semibold">{job.location}</span>
                                       {job.type && (
                                           <span className="bg-lex-light-blue/30 text-lex-med-blue text-sm px-2 py-0.5 rounded-full">
                                               {job.type}
                                           </span>
                                       )}
                                       {job.salary && (
                                           <span className="bg-green-100 text-green-700 text-sm px-2 py-0.5 rounded-full">
                                               {job.salary}
                                           </span>
                                       )}
                                   </div>
                                   <p className="text-gray-600 sm:ml-9 max-w-prose">{job.description}</p>
                                   {job.requirements && (
                                       <div className="mt-4 sm:ml-9">
                                           <h4 className="font-semibold text-gray-700 mb-2">Requirements:</h4>
                                           <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>
                                       </div>
                                   )}
                                </div>
                                 <div className="sm:ml-6 flex-shrink-0">
                                    <a href={`mailto:careers@lexrunit.com?subject=Application for ${job.title}`} className="bg-lex-med-blue text-white font-bold py-2 px-5 rounded-lg hover:bg-lex-bright-blue transition-colors duration-300">
                                        Apply
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 bg-gray-100 rounded-lg">
                        <p className="text-lg text-gray-600">There are currently no open positions. Please check back later!</p>
                    </div>
                )}
            </div>
            )}
             <div className="text-center mt-16 p-8 bg-lex-light-blue/50 rounded-lg">
                 <h3 className="text-2xl font-bold text-lex-dark-blue">Don't see your role?</h3>
                 <p className="text-lg text-gray-700 mt-2">We are always looking for talented and passionate people to join our mission.</p>
                 <a href="mailto:careers@lexrunit.com" className="inline-block mt-4 bg-lex-bright-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-lex-med-blue transition-all duration-300">
                    Send Us Your Resume
                 </a>
             </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
