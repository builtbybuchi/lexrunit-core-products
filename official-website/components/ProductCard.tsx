
import React from 'react'

interface ProductCardProps {
    imageSrc?: string
    title: string
    description: string
    href?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({ imageSrc, title, description, href }) => {
    const isExternal = href ? /^(https?:)?\/\//.test(href) : false

    if (href) {
        return (
            <a
                href={href}
                className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full"
                aria-label={`Open ${title}`}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
            >
                {/* Image */}
                {imageSrc ? (
                    <div className="w-full h-44 md:h-48 lg:h-44 overflow-hidden">
                        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-full h-44 md:h-48 lg:h-44 bg-gray-100" />
                )}

                <div className="p-6">
                    <h3 className="text-xl font-semibold text-lex-dark-blue mb-3">{title}</h3>
                    <p className="text-gray-700 text-base leading-relaxed">{description}</p>

                    <div className="mt-6 flex items-center justify-end">
                        {/* Decorative icon to indicate clickability */}
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white border border-blue-100 shadow-sm group-hover:shadow-md transition pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                                <rect x="3" y="3" width="18" height="18" rx="3" stroke="#3B82F6" strokeWidth="1.5" fill="white" />
                                <path d="M9 14l6-6" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 8h6v6" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>
                </div>
            </a>
        )
    }

    // Fallback non-clickable card when no href is provided
    return (
        <article className="group bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 h-full flex flex-col">
            {/* Image */}
            {imageSrc ? (
                <div className="w-full h-44 md:h-48 lg:h-44 overflow-hidden">
                    <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="w-full h-44 md:h-48 lg:h-44 bg-gray-100" />
            )}

            {/* Content area */}
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-lex-dark-blue mb-3">{title}</h3>
                    <p className="text-gray-700 text-base leading-relaxed">{description}</p>
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <span className="w-10 h-10" />
                </div>
            </div>
        </article>
    )
}

export default ProductCard
