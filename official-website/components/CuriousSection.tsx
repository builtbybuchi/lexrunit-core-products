"use client";
import { useState } from "react";
import { motion } from "framer-motion";

type Props = { compact?: boolean }

export default function OverlappingCards({ compact = false }: Props) {
    const [active, setActive] = useState<number | null>(null);
    const cards = [
        { id: 1, color: "bg-white", z: 30 },
        { id: 2, color: "bg-blue-800", z: 20 },
        { id: 3, color: "bg-sky-400", z: 10 },
    ];
    return (
    <div className={`rounded-3xl px-4 py-6 md:px-8 md:py-12 shadow-lg ${compact ? 'mt-3' : 'mt-12'} font-hand overflow-x-hidden`} style={{ background: "hsl(230, 100%, 26%)", position: "relative" }}>
            <h2 className="text-white text-3xl md:text-5xl mb-8 text-left" style={{ fontWeight: 400 }}>
                Curious, does it work?
            </h2>
            <div className="flex items-center justify-center relative h-[420px] sm:h-[520px] md:h-[760px]">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        className={`${card.color} rounded-2xl border-4 border-white cursor-pointer relative flex flex-col items-center justify-start w-[220px] h-[320px] sm:w-[300px] sm:h-[420px] md:w-[500px] md:h-[700px] ${index !== 0 ? 'ml-[-20px] sm:ml-[-40px] md:ml-[-120px]' : ''}`}
                        style={{
                            zIndex: active === card.id ? 50 : card.z,
                            padding: '1.5rem',
                        }}
                        onClick={() => setActive(active === card.id ? null : card.id)}
                        whileHover={{ scale: 1.05, zIndex: 50 }}
                        animate={{
                            // Double base size on md+ via CSS classes; here we keep interaction scale only
                            scale: active === card.id ? 1.08 : active === null ? 1 : 0.95,
                            zIndex: active === card.id ? 50 : card.z,
                            y: active === card.id ? -20 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        {card.id === 1 && (
                            <>
                                <h3 className="text-blue-900 text-4xl md:text-8xl mb-2 text-left w-full" style={{ fontWeight: 700 }}>
                                    Yes!
                                </h3>
                                <p className="text-blue-900 text-xl md:text-4xl text-left w-full" style={{ fontWeight: 400 }}>
                                    Dr. Andre uses advanced AI system with reference to large medical text to generate trust worthy responses to every question.
                                </p>
                            </>
                        )}
                        {card.id === 2 && (
                            <>
                                <p className="text-white text-xl md:text-4xl text-left w-full" style={{ fontWeight: 400 }}>
                                    The WhatsApp bot is a trustworthy companion. It provides consultation and can provide a report of each consultation with recommendations to be reviewed by medical experts before final decision as to medications or treatments are made.
                                </p>
                            </>
                        )}
                        {card.id === 3 && (
                            <>
                                <p className="text-black text-xl md:text-4xl text-left w-full" style={{ fontWeight: 400 }}>
                                    Get a list of all hospitals close to you instantly, may be you can reach out to them even before heading to the hospitals if need be. We are bringing the hospital to you.
                                </p>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
