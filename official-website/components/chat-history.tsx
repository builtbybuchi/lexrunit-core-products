"use client";

type Props = { compact?: boolean }

export default function ChatHistory({ compact = false }: Props) {
    return (
    <div className={`rounded-3xl px-4 py-6 md:px-8 md:py-12 shadow-lg ${compact ? 'mt-3' : 'mt-12'} flex flex-col items-center font-hand`} style={{ background: "hsl(230, 100%, 26%)", minHeight: "440px", position: "relative" }}>
            <h2 className="w-full text-center text-2xl md:text-3xl font-bold mb-6 text-white" style={{ color: '#f8fafc', fontWeight: 400 }}>
                365 Days of instant medical answers and more just for 8000 naira yearly or 800 naira monthly
            </h2>
            <div className="flex w-full justify-between items-start gap-2 md:gap-8">
                <div className="flex-1 flex justify-start items-start">
                    <img src="/chat.png" alt="Chat" width={360} height={360} className="w-[150%] h-auto md:w-[150%] object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-end items-end">
                    <img src="/andre-pfp.png" alt="Andre Profile" width={360} height={360} className="w-[150%] h-auto md:w-[150%] object-cover" />
                    <a
                        href="https://wa.me/2349012512401"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Start for free on WhatsApp"
                        className="bg-white text-blue-900 text-xl md:text-4xl rounded-lg px-8 py-4 mt-2 shadow text-center border-2 border-blue-900 hover:bg-blue-100 active:scale-95 transition-all duration-150 cursor-pointer font-bold"
                        style={{ width: '90%', fontWeight: 700 }}
                    >
                        Start for free!!!
                    </a>
                </div>
            </div>
        </div>
    );
}
