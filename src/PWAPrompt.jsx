import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   Install command:  npm install framer-motion
───────────────────────────────────────────── */

const PWAPrompt = () => {
    const [showUpdate, setShowUpdate] = useState(false);
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const handleUpdate = () => setShowUpdate(true);
        window.addEventListener('swUpdated', handleUpdate);

        const handleInstall = (e) => { e.preventDefault(); setInstallPrompt(e); };
        window.addEventListener('beforeinstallprompt', handleInstall);

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('swUpdated', handleUpdate);
            window.removeEventListener('beforeinstallprompt', handleInstall);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') setInstallPrompt(null);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');

                .pwa-wrap { font-family: 'Nunito', sans-serif; }

                @keyframes pwa-pulse {
                    0%,100% { opacity:1; transform:scale(1); }
                    50%      { opacity:.5; transform:scale(.85); }
                }
                @keyframes pwa-slide-up {
                    from { opacity:0; transform:translateY(32px) scale(.96); }
                    to   { opacity:1; transform:translateY(0)     scale(1);  }
                }
                @keyframes pwa-glow {
                    0%,100% { box-shadow: 0 4px 24px rgba(99,102,241,.5); }
                    50%      { box-shadow: 0 4px 36px rgba(99,102,241,.8); }
                }
                .pwa-install-card { animation: pwa-slide-up .38s cubic-bezier(.22,1,.36,1) both; }
                .pwa-install-btn  { animation: pwa-glow 2.2s ease-in-out infinite; }
                .pwa-dot          { animation: pwa-pulse 1.4s ease-in-out infinite; }
            `}</style>

            <div className="pwa-wrap fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999]
                            flex flex-col items-center gap-2.5
                            w-[calc(100%-24px)] max-w-[420px]
                            pointer-events-none">

                {/* ── OFFLINE PILL ── */}
                <AnimatePresence>
                    {isOffline && (
                        <motion.div
                            initial={{ opacity: 0, scale: .85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: .85 }}
                            className="pointer-events-auto
                                       flex items-center gap-2 self-center
                                       bg-[#1e1e2e] text-white
                                       px-4 py-1.5 rounded-full
                                       border border-white/10 shadow-xl"
                        >
                            <span className="pwa-dot w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                You're offline
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── UPDATE BAR ── */}
                <AnimatePresence>
                    {showUpdate && (
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                            className="pointer-events-auto w-full
                                       bg-indigo-600 text-white
                                       rounded-2xl px-4 py-3
                                       flex items-center justify-between gap-3
                                       shadow-lg shadow-indigo-500/30"
                        >
                            <div className="flex items-center gap-2.5">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                                </svg>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.2 }}>Update ready</p>
                                    <p style={{ fontSize: 11, fontWeight: 600, opacity: .75 }}>Tap to get the latest version</p>
                                </div>
                            </div>
                            <button
                                onClick={() => window.forceSWUpdate?.()}
                                className="bg-white text-indigo-700 rounded-xl px-4 py-1.5 flex-shrink-0
                                           active:scale-95 transition-transform"
                                style={{ fontSize: 12, fontWeight: 800 }}
                            >
                                Update
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── INSTALL CARD ── */}
                <AnimatePresence>
                    {installPrompt && (
                        <div className="pwa-install-card pointer-events-auto w-full
                                        rounded-3xl overflow-hidden
                                        shadow-[0_16px_48px_rgba(0,0,0,0.18)]
                                        border border-white/60
                                        bg-white">

                            {/* Coloured header strip */}
                            <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500
                                            px-5 pt-5 pb-14 relative overflow-hidden">
                                {/* Decorative circles */}
                                <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
                                <div className="absolute top-4 right-10  w-10 h-10 rounded-full bg-white/10" />

                                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)' }}>
                                    Install App
                                </p>
                                <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginTop: 2, lineHeight: 1.25 }}>
                                    SikhaSetu
                                </p>
                                <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.75)', marginTop: 3 }}>
                                    Learn smarter, anytime — even offline
                                </p>
                            </div>

                            {/* Logo bubble — overlaps strip */}
                            <div className="relative -mt-10 px-5 flex items-end justify-between">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden
                                                border-4 border-white
                                                shadow-[0_8px_24px_rgba(0,0,0,0.15)]
                                                bg-gradient-to-br from-violet-100 to-indigo-100
                                                flex items-center justify-center flex-shrink-0">
                                    {!imgError ? (
                                        <img
                                            src="/SikhaSetuLogo1.png"
                                            alt="SikhaSetu"
                                            className="w-full h-full object-contain"
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <span style={{ fontSize: 32, fontWeight: 900, color: '#6366f1', lineHeight: 1 }}>S</span>
                                    )}
                                </div>

                                {/* Feature pills top-right */}
                                <div className="flex gap-1.5 pb-1 flex-wrap justify-end">
                                    {[
                                        { icon: '⚡', label: 'Fast' },
                                        { icon: '📴', label: 'Offline' },
                                    ].map(({ icon, label }) => (
                                        <span key={label}
                                            className="flex items-center gap-1 bg-indigo-50 text-indigo-700
                                                       rounded-full px-2.5 py-1"
                                            style={{ fontSize: 11, fontWeight: 700 }}>
                                            <span style={{ fontSize: 11 }}>{icon}</span>{label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom action area */}
                            <div className="px-5 pt-3 pb-5">
                                <button
                                    onClick={handleInstallClick}
                                    className="pwa-install-btn w-full
                                               bg-gradient-to-r from-violet-600 to-indigo-600
                                               text-white rounded-2xl py-3.5
                                               active:scale-[.98] transition-transform"
                                    style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.01em' }}
                                >
                                    Install App
                                </button>
                                <button
                                    onClick={() => setInstallPrompt(null)}
                                    className="w-full mt-2 py-1.5 text-gray-400
                                               active:text-gray-600 transition-colors"
                                    style={{ fontSize: 12, fontWeight: 700 }}
                                >
                                    Later
                                </button>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default PWAPrompt;