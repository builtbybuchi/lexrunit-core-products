
"use client";

type Props = { compact?: boolean }

export default function AboutAndre({ compact = false }: Props) {
    return (
    <div className={`rounded-3xl px-4 py-6 md:px-8 md:py-12 shadow-lg ${compact ? 'mt-3' : 'mt-12'} flex flex-col md:flex-row items-stretch w-full font-hand overflow-hidden md:min-h-[440px]`} style={{ background: "hsl(230, 100%, 26%)", position: "relative" }}>
            {/* Left Side */}
            <div className="flex-1 flex flex-col justify-start items-start px-2 md:px-8">
                <h2 className="text-white text-4xl md:text-8xl mb-4" style={{ fontWeight: 700 }}>
                    What are you asking?
                </h2>
                <p className="text-white text-2xl md:text-3xl mb-6" style={{ fontWeight: 500, opacity: 0.95 }}>
                    If it's medical, Dr Andre can help
                </p>
                <a
                    href="https://wa.me/2349012512401"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Start a free conversation on WhatsApp"
                    className="bg-white text-blue-900 text-lg md:text-2xl rounded-lg px-8 py-6 mb-4 shadow text-center border-2 border-blue-900 hover:bg-blue-100 active:scale-95 transition-all duration-150 cursor-pointer"
                    style={{ fontWeight: 700 }}
                >
                    Start a free conversation
                </a>
                <p className="text-white text-base md:text-2xl mt-2" style={{ fontWeight: 400, opacity: 0.8, maxWidth: '420px' }}>
                    Dr Andre and all Lexrunit medical projects are not supported by any investor, VC or any third party organisation. Our focus is to provide quality health solutions to all our users to ensure safety, privacy and superior health coverage to all.
                </p>
            </div>
            {/* Right Side: Bluish gray box with three stacked white rectangles */}
            <div className="flex-1 flex items-center justify-center px-2 md:px-8 mt-6 md:mt-0">
                <div className="bg-blue-900/60 rounded-3xl w-full max-w-xl p-6 flex flex-col gap-6">
                    {/* Box 1 */}
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col w-full">
                        <h3 className="text-blue-900 text-2xl md:text-3xl mb-2" style={{ fontWeight: 700 }}>Use Dr Andre</h3>
                        <p className="text-blue-900 text-lg md:text-xl" style={{ fontWeight: 500 }}>
                            Get quick responses to all medical questions, consult with our AI system and get a repository of all medical facilities around you.
                        </p>
                    </div>
                    {/* Box 2 */}
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col w-full">
                        <h3 className="text-blue-900 text-2xl md:text-3xl mb-2" style={{ fontWeight: 700 }}>Register your hospital</h3>
                        <p className="text-blue-900 text-lg md:text-xl" style={{ fontWeight: 500 }}>
                            Add your hospital to our list of hospitals so users in your city can be referred to you.
                        </p>
                    </div>
                    {/* Box 3 */}
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col w-full">
                        <h3 className="text-blue-900 text-2xl md:text-3xl mb-2" style={{ fontWeight: 700 }}>Give feedback</h3>
                        <p className="text-blue-900 text-lg md:text-xl" style={{ fontWeight: 500 }}>
                            We want to know how to serve you better, we are listening
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}