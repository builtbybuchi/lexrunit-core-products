import React from 'react';
import { Hospital } from '../lib/hospitalService';
import { HospitalIcon, AiDoctorIcon, PatientAppIcon } from './icons/ProductIcons';

interface HospitalCardProps {
    hospital: Hospital;
}

const ProductBadge: React.FC<{ product: string }> = ({ product }) => {
    let icon = null;
    let label = '';
    let colorClass = '';

    switch (product) {
        case 'lexcare-hms':
            icon = <HospitalIcon />;
            label = "L'Hopital";
            colorClass = 'bg-lex-med-blue text-white';
            break;
        case 'dr-andre':
            icon = <AiDoctorIcon />;
            label = 'Dr. Andre';
            colorClass = 'bg-lex-bright-blue text-white';
            break;
        case 'lexcare-patients':
            icon = <PatientAppIcon />;
            label = 'LexCare';
            colorClass = 'bg-lex-dark-blue text-white';
            break;
        default:
            return null;
    }

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${colorClass}`}>
            <span className="w-3 h-3">{icon}</span>
            {label}
        </span>
    );
};

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-5 flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{hospital.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{hospital.address}, {hospital.city}, {hospital.state}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                    {hospital.products.map((product) => (
                        <ProductBadge key={product} product={product} />
                    ))}
                </div>
            </div>

            {(hospital.website || hospital.phone || hospital.email) && (
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center text-sm">
                    {hospital.website && (
                        <a
                            href={hospital.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lex-med-blue hover:text-lex-dark-blue font-medium"
                        >
                            Visit Website
                        </a>
                    )}
                    {/* Add phone/email actions if needed */}
                </div>
            )}
        </div>
    );
};

export default HospitalCard;
