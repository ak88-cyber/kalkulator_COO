/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VehicleConfig, CalculatorState, VEHICLE_DATA } from '../types';
import { Info, Leaf, Shield, Landmark, Flame, ShieldAlert, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';

interface ComparisonCardsProps {
  state: CalculatorState;
}

export default function ComparisonCards({ state }: ComparisonCardsProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  const calculateBreakdown = (car: VehicleConfig) => {
    const kmPerMonth = state.monthlyDistance;
    const opCostPerMonth = kmPerMonth * car.costPerKm;

    const custom = state.customCosts[car.id] || { cicilan: 0, perawatan: 0, asuransi: 0 };
    const cicilan = state.useCustomParams ? custom.cicilan : 0;
    const asuransi = state.useCustomParams ? custom.asuransi : 0;
    const perawatanExtra = state.useCustomParams ? custom.perawatan : 0;

    const totalCostPerMonth = opCostPerMonth + cicilan + asuransi + perawatanExtra;
    const totalLifetimeCost = totalCostPerMonth * 12 * state.ownershipYears;

    const co2PerMonthKg = (kmPerMonth * car.co2PerKm) / 1000;
    const co2LifetimeKg = co2PerMonthKg * 12 * state.ownershipYears;

    return {
      opCostPerMonth,
      cicilan,
      asuransi,
      perawatanExtra,
      totalCostPerMonth,
      totalLifetimeCost,
      co2LifetimeKg,
    };
  };

  const bbmData = calculateBreakdown(VEHICLE_DATA.find(v => v.id === 'bbm') || VEHICLE_DATA[4]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4" id="comparison-cards-section">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-display text-white" id="cards-header-title">
            Detail Perbandingan Kendaraan
          </h3>
          <p className="text-xs text-slate-400">
            Rincian komprehensif biaya per kilometer, pengeluaran tetap, dan skenario pajak.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VEHICLE_DATA.map((car) => {
          const breakdown = calculateBreakdown(car);
          const isBbm = car.id === 'bbm';
          const savingsLifetime = bbmData.totalLifetimeCost - breakdown.totalLifetimeCost;
          const co2SavedLifetime = bbmData.co2LifetimeKg - breakdown.co2LifetimeKg;
          const isExpanded = expandedCard === car.id;

          return (
            <motion.div
              layout
              key={car.id}
              id={`detail-card-${car.id}`}
              className={`bg-[#0f172a]/60 backdrop-blur-xs rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col h-full shadow-[0_0_20px_rgba(255,255,255,0.01)] ${
                isExpanded
                  ? 'ring-2 ring-cyan-500/30 border-cyan-500'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Category Indicator Tag at Top Corner */}
              <div className="absolute top-0 right-0 z-10">
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl text-white ${
                    car.category === 'listrik'
                      ? 'bg-emerald-600'
                      : car.category === 'hibrida'
                      ? 'bg-amber-600'
                      : 'bg-red-600'
                  }`}
                >
                  {car.category}
                </span>
              </div>

              {/* Main Info Header */}
              <div className="p-5 flex-1 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 pt-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: car.color }}
                    />
                    <h4 className="font-bold text-white text-sm md:text-md pr-14 leading-tight">
                      {car.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 h-8 leading-snug">
                    {car.description}
                  </p>
                </div>

                {/* Main Cost Figure */}
                <div className="bg-[#020617]/50 p-4 rounded-xl space-y-1 border border-slate-800/80">
                  <span className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">
                    Estimasi Biaya Bulanan
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-extrabold font-mono text-white">
                      {formatCurrency(breakdown.totalCostPerMonth)}
                    </span>
                    <span className="text-xs text-slate-400">/bln</span>
                  </div>
                </div>

                {/* Sub-Items showing key factors */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-800 text-slate-350">
                    <span>Biaya dasar per kilometer</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {formatCurrency(car.costPerKm)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-800 text-slate-350">
                    <span>Biaya operasional bulanan</span>
                    <span className="font-mono text-slate-250">
                      {formatCurrency(breakdown.opCostPerMonth)}
                    </span>
                  </div>

                  {state.useCustomParams && (
                    <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-800 text-violet-400">
                      <span>Biaya tetap bulanan (cicilan dll)</span>
                      <span className="font-mono">
                        +{formatCurrency(breakdown.cicilan + breakdown.asuransi + breakdown.perawatanExtra)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Lifetime Cost projection for selection */}
                <div className="pt-2 text-xs">
                  <div className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                    Proyeksi {state.ownershipYears} Tahun
                  </div>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {formatCurrency(breakdown.totalLifetimeCost)}
                  </div>
                </div>

                {/* Savings section */}
                {!isBbm && (
                  <div className="space-y-1.5 pt-1 border-t border-slate-800">
                    {savingsLifetime > 0 ? (
                      <div className="bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-900/30 flex items-start gap-1.5 text-xs text-emerald-400">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span>Menghemat <strong>{formatCurrency(savingsLifetime)}</strong> selama {state.ownershipYears} tahun dibandingkan mobil BBM konvensional.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-950/20 p-2.5 rounded-xl border border-red-900/30 flex items-start gap-1.5 text-xs text-red-405">
                        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <span>Lebih tinggi <strong>{formatCurrency(Math.abs(savingsLifetime))}</strong> dari BBM akibat set-up biaya tetap kustom Anda.</span>
                        </div>
                      </div>
                    )}

                    {co2SavedLifetime > 0 && (
                      <div className="bg-teal-950/15 p-2.5 rounded-xl border border-teal-900/40 flex items-start gap-1.5 text-xs text-teal-400">
                        <Leaf className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>Mencegah emisi sebesar <strong>{co2SavedLifetime.toLocaleString('id-ID', { maximumFractionDigits: 0 })} kg CO₂</strong> ke udara!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Expansion toggles for details */}
              <div className="bg-[#020617]/50 px-5 py-3 border-t border-slate-805 flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => toggleExpand(car.id)}
                  className="flex items-center justify-between text-xs text-slate-400 hover:text-white transition-colors cursor-pointer w-full"
                  id={`btn-expand-${car.id}`}
                >
                  <span className="font-semibold">Informasi Skenario Tarif</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-3 space-y-2 text-xs text-slate-350 border-t border-slate-800 mt-2"
                    id={`expanded-content-${car.id}`}
                  >
                    <div>
                      <div className="font-bold text-slate-205 flex items-center gap-1">
                        <Landmark className="w-3.5 h-3.5 text-cyan-405" /> Aspek Pajak Kendaraan (PKB):
                      </div>
                      <p className="pl-4.5 text-slate-400 mt-0.5">{car.taxScenario}</p>
                    </div>
                    <div>
                      <div className="font-bold text-slate-205 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-400" /> Sumber Energi / Pengisian:
                      </div>
                      <p className="pl-4.5 text-slate-400 mt-0.5">{car.energyScenario}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
