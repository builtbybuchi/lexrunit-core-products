import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import HospitalCard from '../../components/HospitalCard';
import { getHospitals, submitMessage, Hospital } from '../../lib/hospitalService';

export default function FindHospitalsPage() {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        state: '',
        city: '',
        product: ''
    });

    // Form state for recommendation/registration
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        hospitalName: '',
        message: '',
        type: 'recommendation' as 'recommendation' | 'registration'
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    useEffect(() => {
        fetchHospitals();
    }, [filters]);

    const fetchHospitals = async () => {
        setLoading(true);
        // Filter out empty strings to pass undefined to service
        const activeFilters = {
            state: filters.state || undefined,
            city: filters.city || undefined,
            product: filters.product || undefined
        };

        const data = await getHospitals(activeFilters);
        setHospitals(data);
        setLoading(false);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');

        const success = await submitMessage(formData);
        if (success) {
            setFormStatus('success');
            setFormData({ name: '', email: '', hospitalName: '', message: '', type: 'recommendation' });
        } else {
            setFormStatus('error');
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-gray-50">
            <PageHeader
                title="Find Hospitals"
                subtitle="Locate healthcare facilities using LexCare solutions near you."
            />

            <div className="container mx-auto px-4 md:px-6 py-12">
                {/* Filters */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-10 border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Filter Hospitals</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            name="state"
                            value={filters.state}
                            onChange={handleFilterChange}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lex-med-blue focus:border-transparent outline-none"
                        >
                            <option value="">All States</option>
                            {/* TODO: Populate states dynamically if possible, or hardcode common ones */}
                            <option value="Lagos">Lagos</option>
                            <option value="Abuja">Abuja</option>
                            <option value="Rivers">Rivers</option>
                        </select>

                        <select
                            name="city"
                            value={filters.city}
                            onChange={handleFilterChange}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lex-med-blue focus:border-transparent outline-none"
                        >
                            <option value="">All Cities</option>
                            {/* TODO: Dependent dropdown logic could be added here */}
                            <option value="Ikeja">Ikeja</option>
                            <option value="Lekki">Lekki</option>
                            <option value="Yaba">Yaba</option>
                        </select>

                        <select
                            name="product"
                            value={filters.product}
                            onChange={handleFilterChange}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lex-med-blue focus:border-transparent outline-none"
                        >
                            <option value="">All Products</option>
                            <option value="lexcare-hms">L'Hopital</option>
                            <option value="dr-andre">Dr. Andre</option>
                            <option value="lexcare-patients">L'Hopital</option>
                        </select>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lex-med-blue mx-auto"></div>
                        <p className="mt-4 text-gray-500">Finding hospitals...</p>
                    </div>
                ) : hospitals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hospitals.map((hospital) => (
                            <HospitalCard key={hospital.$id} hospital={hospital} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No hospitals found</h3>
                        <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                    </div>
                )}
            </div>

            {/* Recommendation / Registration Section */}
            <section id="register" className="bg-lex-dark-blue py-16 text-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 text-center">
                        <h2 className="text-3xl font-bold mb-4">Don't see your hospital?</h2>
                        <p className="text-lex-light-blue text-lg mb-8">
                            Are you a hospital administrator looking to join the LexCare network?
                            Partner with us to streamline your operations and improve patient care.
                        </p>

                        <a
                            href="/partner"
                            className="inline-block bg-lex-bright-blue text-white px-8 py-3 rounded-full font-bold hover:bg-lex-med-blue transition-all transform hover:scale-105"
                        >
                            Partner with Us
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
