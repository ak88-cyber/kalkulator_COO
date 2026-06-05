/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VehicleConfig, CalculatorState, VEHICLE_DATA } from '../types';
import { Gauge, Calendar, Settings, Coins, Shield, HelpCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface InputSectionProps {
  state: CalculatorState;
  onChange: (newState: CalculatorState) => void;
}

export default function InputSection({ state, onChange }: InputSectionProps) {
  const handleDailyChange = (value: number) => {
    const monthly = Math.round(value * 30.4);
    onChange({
      ...state,
      dailyDistance: value,
      monthlyDistance: monthly,
    });
  };

  const handleMonthlyChange = (value: number) => {
    const daily = Math.round((value / 30.4) * 10) / 10;
    onChange({
      ...state,
      monthlyDistance: value,
      dailyDistance: daily,
    });
  };

  const handleYearChange = (years: number) => {
    onChange({
      ...state,
      ownershipYears: years,
    });
  };

  const toggleCustomParams = () => {
    onChange({
      ...state,
      useCustomParams: !state.useCustomParams,
    });
  };

  const handleCustomCostChange = (vehicleId: string, field: 'cicilan' | 'perawatan' | 'asuransi', val: number) => {
    onChange({
      ...state,
      customCosts: {
        ...state.customCosts,
        [vehicleId]: {
          ...state.customCosts[vehicleId],
          [field]: val,
        },
      },
    });
  };

  return (
    <div className="space-y-6" id="input-section">
      {/* Card Input Jarak Tempuh */}
      <div className="bg-[#0f172a]/60 backdrop-blur-xs rounded-2xl p-6 border border-slate-800 shadow-[0_0_20px_rgba(255,255,255,0.01)] space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
            <Gauge className="w-5 h-5" id="icon-gauge" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-white" id="title-jarak-tempuh">
              Jarak Tempuh Kendaraan
            </h2>
            <p className="text-xs text-slate-400">
              Tentukan seberapa jauh Anda berkendara untuk menghitung biaya operasional.
            </p>
          </div>
        </div>

        {/* Jarak Tempuh Harian */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5" id="label-harian">
              Rata-rata Jarak Harian
            </label>
            <span className="text-md font-bold font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-lg">
              {state.dailyDistance.toLocaleString('id-ID')} km<span className="text-xs font-normal text-slate-400">/hari</span>
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="300"
            step="1"
            value={state.dailyDistance}
            onChange={(e) => handleDailyChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none"
            id="slider-harian"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>1 km</span>
            <span>50 km</span>
            <span>100 km</span>
            <span>200 km</span>
            <span>300 km</span>
          </div>
        </div>

        {/* Jarak Tempuh Bulanan */}
        <div className="space-y-2 bg-[#020617]/40 p-4 rounded-xl border border-slate-800/60">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-400" id="label-bulanan">
              Estimasi Jarak Bulanan (x30.4 hari)
            </label>
            <span className="text-sm font-bold font-mono text-slate-200">
              {state.monthlyDistance.toLocaleString('id-ID')} km<span className="text-xs font-normal text-slate-500">/bulan</span>
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="10000"
            step="50"
            value={state.monthlyDistance}
            onChange={(e) => handleMonthlyChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
            id="slider-bulanan"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>100 km</span>
            <span>2.500 km</span>
            <span>5.000 km</span>
            <span>10.000 km</span>
          </div>
        </div>
      </div>

      {/* Card Durasi Kepemilikan */}
      <div className="bg-[#0f172a]/60 backdrop-blur-xs rounded-2xl p-6 border border-slate-800 shadow-[0_0_20px_rgba(255,255,255,0.01)] space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
            <Calendar className="w-5 h-5" id="icon-calendar" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-white" id="title-durasikep">
              Proyeksi Jangka Waktu
            </h2>
            <p className="text-xs text-slate-400">
              Tinjau perbandingan akumulasi biaya dalam jangka waktu tertentu.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[1, 3, 5, 8].map((year) => (
            <button
              key={year}
              id={`btn-durasi-${year}`}
              type="button"
              onClick={() => handleYearChange(year)}
              className={`py-3 px-2 rounded-xl text-center border font-display transition-all duration-200 cursor-pointer text-sm ${
                state.ownershipYears === year
                  ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400 font-bold shadow-xs shadow-cyan-950/50'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="text-lg leading-tight">{year}</div>
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">Tahun</div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Custom Costs Toggle */}
      <div className="bg-[#0f172a]/60 backdrop-blur-xs rounded-2xl p-6 border border-slate-800 shadow-[0_0_20px_rgba(255,255,255,0.01)] space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-violet-550/10 rounded-xl text-violet-405">
              <Settings className="w-5 h-5 text-violet-400" id="icon-settings" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white" id="title-biaya-tambahan">
                Biaya Tambahan Pemilik (Opsional)
              </h2>
              <p className="text-xs text-slate-400">
                Ubah cicilan bulanan, perawatan, & asuransi per mobil.
              </p>
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={toggleCustomParams}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                state.useCustomParams
                  ? 'bg-violet-600 hover:bg-violet-750 text-white shadow-md shadow-violet-950/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              id="btn-toggle-custom"
            >
              {state.useCustomParams ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>
        </div>

        {state.useCustomParams ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.25 }}
            className="space-y-6 pt-2"
            id="panel-custom-biaya"
          >
            <div className="p-3 bg-violet-950/20 rounded-xl border border-violet-900/40 text-xs text-violet-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-violet-405" />
              <span>
                <strong>Catatan Kustomisasi:</strong> Biaya operasional dasar (bahan bakar/energi + perawatan dasar) sudah termasuk dalam tarif per kilometer. Skenario di bawah memungkinkan Anda menambah pengeluaran bulanan tetap seperti <strong>cicilan bank</strong> atau <strong>premi asuransi eksklusif</strong>.
              </span>
            </div>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {VEHICLE_DATA.map((car) => {
                const costs = state.customCosts[car.id] || { cicilan: 0, perawatan: 0, asuransi: 0 };
                return (
                  <div
                    key={car.id}
                    id={`custom-card-${car.id}`}
                    className="border border-slate-800 rounded-xl p-4 space-y-3 bg-[#020617]/50 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: car.color }}
                      />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        {car.shortName}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Cicilan */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          <Coins className="w-3 h-3" /> Cicilan Bulanan
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-xs text-slate-405 font-bold font-mono">Rp</span>
                          <input
                            type="text"
                            value={costs.cicilan === 0 ? '' : costs.cicilan}
                            placeholder="0"
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '');
                              handleCustomCostChange(car.id, 'cicilan', v ? Number(v) : 0);
                            }}
                            className="pl-8 pr-2 py-1 w-full text-xs font-mono border border-slate-800 bg-[#090d16] rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                          />
                        </div>
                      </div>

                      {/* Asuransi */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Asuransi /Bulan
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-xs text-slate-405 font-bold font-mono">Rp</span>
                          <input
                            type="text"
                            value={costs.asuransi === 0 ? '' : costs.asuransi}
                            placeholder="0"
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '');
                              handleCustomCostChange(car.id, 'asuransi', v ? Number(v) : 0);
                            }}
                            className="pl-8 pr-2 py-1 w-full text-xs font-mono border border-slate-800 bg-[#090d16] rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                          />
                        </div>
                      </div>

                      {/* Perawatan Extra */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          <Settings className="w-3 h-3" /> Perawatan Lain/Bln
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-xs text-slate-405 font-bold font-mono">Rp</span>
                          <input
                            type="text"
                            value={costs.perawatan === 0 ? '' : costs.perawatan}
                            placeholder="0"
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '');
                              handleCustomCostChange(car.id, 'perawatan', v ? Number(v) : 0);
                            }}
                            className="pl-8 pr-2 py-1 w-full text-xs font-mono border border-slate-800 bg-[#090d16] rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            Klik 'Aktif' untuk mensimulasikan tambahan cicilan kredit, asuransi bulanan, atau biaya rutin kustom lainnya.
          </p>
        )}
      </div>

      {/* Skenario Penjelasan Ringkas Info */}
      <div className="bg-[#0f172a]/40 rounded-2xl p-5 border border-slate-800 text-xs space-y-3 leading-relaxed text-slate-400">
        <h4 className="font-semibold text-white flex items-center gap-1">
          <HelpCircle className="w-4 h-4 text-cyan-405" /> Skenario Biaya Terpasang:
        </h4>
        <ul className="list-disc list-inside space-y-1.5">
          <li><strong>Listrik 1:</strong> Pajak Bebas (Insentif) &amp; Charge rumah malam hari (Diskon PLN 30%).</li>
          <li><strong>Listrik 2:</strong> Pengisian di rumah (Diskon PLN 30%), namun tanpa insentif (Bayar PKB 100%).</li>
          <li><strong>Listrik 3:</strong> Mengisi baterai full di SPKLU umum (Pajak PKB 100%).</li>
          <li><strong>Hibrida:</strong> Biaya gabungan normal bensin &amp; regenerasi hibrida (Pajak normal).</li>
          <li><strong>Mobil BBM:</strong> Biaya murni operasional bensin berdasar efisiensi normal (Pajak normal).</li>
        </ul>
      </div>
    </div>
  );
}
