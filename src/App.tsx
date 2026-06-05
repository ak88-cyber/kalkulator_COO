/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CalculatorState, VEHICLE_DATA } from './types';
import InputSection from './components/InputSection';
import VisualChart from './components/VisualChart';
import ComparisonCards from './components/ComparisonCards';
import SavingsEstimator from './components/SavingsEstimator';
import { Car, Zap, Sparkles, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

const INITIAL_STATE: CalculatorState = {
  dailyDistance: 50,
  monthlyDistance: 1520, // 50 * 30.4 rounded
  ownershipYears: 5,
  useCustomParams: false,
  icvPercent: 0,
  customCosts: {
    listrik_1: { cicilan: 0, perawatan: 0, asuransi: 0 },
    listrik_2: { cicilan: 0, perawatan: 0, asuransi: 0 },
    listrik_3: { cicilan: 0, perawatan: 0, asuransi: 0 },
    hibrida: { cicilan: 0, perawatan: 0, asuransi: 0 },
    bbm: { cicilan: 0, perawatan: 0, asuransi: 0 },
  }
};

export default function App() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load state from localStorage on init and set dark class
  useEffect(() => {
    document.documentElement.classList.add('dark');
    const saved = localStorage.getItem('tco_calculator_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all required fields exist in case types changed
        if (parsed.dailyDistance && parsed.monthlyDistance && parsed.customCosts) {
          setState(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }, []);

  const handleStateChange = (newState: CalculatorState) => {
    setState(newState);
    localStorage.setItem('tco_calculator_state', JSON.stringify(newState));
  };

  const handleReset = () => {
    setState(INITIAL_STATE);
    localStorage.setItem('tco_calculator_state', JSON.stringify(INITIAL_STATE));
  };

  // Toggle local theme
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-100 font-sans tracking-normal transition-colors duration-300 ${theme === 'light' ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#020617] text-slate-100 dark:bg-[#020617]'}`}>
      
      {/* Top ambient color splashes */}
      <div className="absolute top-0 inset-x-0 h-[640px] bg-linear-to-b from-cyan-500/10 via-emerald-500/5 to-transparent dark:from-cyan-950/20 dark:via-emerald-950/5 dark:to-transparent pointer-events-none -z-10" />

      {/* Header Bar */}
      <header className="border-b border-slate-800 dark:border-slate-800 bg-[#0f172a]/80 dark:bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl text-white shadow-lg shadow-cyan-550/20 flex items-center justify-center">
              <Zap className="w-5 h-5" id="logo-icon-zap" />
            </div>
            <div>
              <h1 className="text-md sm:text-lg font-extrabold font-display leading-tight text-white dark:text-white flex items-center gap-1.5" id="app-heading-brand">
                Kalkulator Biaya Kepemilikan Mobil
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 dark:text-cyan-400 font-mono">
                Total Cost of Ownership (TCO) Simulator
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="p-2 text-slate-300 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-slate-800 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold border border-slate-800 hover:border-slate-700 dark:border-slate-800 dark:hover:border-slate-700"
              title="Reset data kalkulator"
              id="btn-reset-app"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-350 dark:text-slate-350 hover:bg-slate-800 dark:hover:bg-slate-800 rounded-xl border border-slate-800 hover:border-slate-705 transition-all cursor-pointer"
              title="Ganti tema warna"
              id="btn-theme-toggle"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-400 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 4.344l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Hero / Intro */}
        <section className="bg-gradient-to-b from-[#1e293b]/50 to-[#0f172a]/35 rounded-3xl p-6 sm:p-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-linear-to-bl from-cyan-500/15 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-cyan-405 bg-cyan-500/10 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-405" />
              Skenario Riil Indonesia
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white dark:text-white tracking-tight leading-tight">
              Ketahui Biaya Pengeluaran Riil Mobil Listrik, Hibrida, &amp; BBM
            </h2>
            <p className="text-sm text-slate-350 dark:text-slate-350 leading-relaxed">
              Bandingkan struktur pengeluaran total secara akurat berdasarkan <strong>tarif biaya kepemilikan per kilometer</strong> yang bersumber dari skenario riil di Indonesia. Sesuaikan jarak berkendara harian Anda dan temukan seberapa banyak Anda akan menghemat uang dan meredam emisi gas buang dalam hitungan tahunan.
            </p>
          </div>
        </section>

        {/* Primary Interactive Panels Divider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: controls and custom values (40% space on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            <InputSection state={state} onChange={handleStateChange} />
          </div>

          {/* Right panel: Live comparison charts and dynamic indicators (70% space on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <VisualChart state={state} />
            <SavingsEstimator state={state} />
          </div>

        </div>

        {/* Expandable Individual Vehicle Breakdown Cards Section */}
        <section className="pt-4">
          <ComparisonCards state={state} />
        </section>

        {/* Additional Interactive FAQ / Context Guide */}
        <section className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 space-y-4 transition-colors">
          <h3 className="text-md font-bold font-display text-slate-205 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" /> Informasi Mengenai Skenario Listrik (1, 2, &amp; 3)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-905/60 border border-slate-800">
              <h4 className="font-bold text-cyan-400">⚡ Mobil Listrik 1</h4>
              <p className="leading-relaxed">
                Asumsi ideal saat ini: Pemilik memanfaatkan diskon pengisian daya rumah (diskon 30% dari PLN untuk jam 22.00 - 05.00) serta menikmati <strong>insentif penuh pembebasan Pajak Kendaraan Bermotor (PKB)</strong> sebesar 0% yang diberikan pemerintah untuk mendorong transisi energi hijau.
              </p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-905/60 border border-slate-800">
              <h4 className="font-bold text-blue-400">⚡ Mobil Listrik 2</h4>
              <p className="leading-relaxed">
                Asumsi pasca-insentif: Mengulas kondisi ketika masa diskon insentif pajak kendaraan listrik berakhir, sehingga pemilik wajib membayar <strong>pajak tahunan (PKB) normal 100%</strong>, namun tetap mengandalkan diskon pengisian daya rumah PLN sebesar 30% di malam hari.
              </p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-905/60 border border-slate-800">
              <h4 className="font-bold text-indigo-400">⚡ Mobil Listrik 3</h4>
              <p className="leading-relaxed">
                Asumsi murni SPKLU: Sangat relevan bagi warga apartemen atau rumah tanpa instalasi home charger. Pengisian daya dilakukan sepenuhnya di <strong>SPKLU umum komersial</strong> (tarif tanpa diskon) dan wajib membayar <strong>PKB normal 100%</strong> tahunan.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Humble, Professional Footer */}
      <footer className="border-t border-slate-850 dark:border-slate-850 bg-slate-950/80 py-8 text-center text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center space-x-1">
            <Car className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-300">Kalkulator Biaya Kepemilikan Bulanan</span>
          </div>
          <p>
            Aplikasi ini dirancang sebagai panduan simulasi Total Cost of Ownership (TCO) interaktif di Indonesia.
          </p>
          <p className="text-[10px] text-slate-500 font-mono">
            Tarif Dasar Terpasang: Listrik 1 (Rp 244/km) • Listrik 2 (Rp 971/km) • Listrik 3 (Rp 1.144/km) • Hibrida (Rp 1.323/km) • BBM (Rp 1.664/km)
          </p>
        </div>
      </footer>
    </div>
  );
}
