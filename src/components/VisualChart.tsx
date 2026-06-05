/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VehicleConfig, CalculatorState, VEHICLE_DATA } from '../types';
import { Leaf, Info, DollarSign, TrendingDown, ArrowDownRight, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VisualChartProps {
  state: CalculatorState;
}

export default function VisualChart({ state }: VisualChartProps) {
  const [activeTab, setActiveTab] = useState<'financial' | 'environmental'>('financial');
  const [timeframe, setTimeframe] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');

  // Calculates the TCO for a given vehicle configuration
  const calculateCosts = (car: VehicleConfig) => {
    // 1. Operational Cost
    const kmPerMonth = state.monthlyDistance;
    const opCostPerMonth = kmPerMonth * car.costPerKm;

    // 2. Custom Fixed Costs
    const custom = state.customCosts[car.id] || { cicilan: 0, perawatan: 0, asuransi: 0 };
    const fixedCostPerMonth = state.useCustomParams
      ? (custom.cicilan + custom.asuransi + custom.perawatan)
      : 0;

    const totalCostPerMonth = opCostPerMonth + fixedCostPerMonth;

    // Scale by timeframe
    let multiplier = 1;
    if (timeframe === 'yearly') {
      multiplier = 12;
    } else if (timeframe === 'lifetime') {
      multiplier = 12 * state.ownershipYears;
    }

    const totalCost = totalCostPerMonth * multiplier;
    const opCostTotal = opCostPerMonth * multiplier;
    const fixedCostTotal = fixedCostPerMonth * multiplier;

    // Emissions (CO2)
    const co2PerMonthKg = (kmPerMonth * car.co2PerKm) / 1000;
    const totalCo2 = co2PerMonthKg * multiplier;

    return {
      totalCost,
      opCostTotal,
      fixedCostTotal,
      totalCo2,
    };
  };

  const results = VEHICLE_DATA.map((car) => {
    const calc = calculateCosts(car);
    return {
      ...car,
      ...calc,
    };
  });

  // Find minimum financial cost and maximum for scaling
  const minCostItem = [...results].sort((a, b) => a.totalCost - b.totalCost)[0];
  const maxCost = Math.max(...results.map((r) => r.totalCost));

  // Find minimum environmental CO2 and max scaling
  const minCo2Item = [...results].sort((a, b) => a.totalCo2 - b.totalCo2)[0];
  const maxCo2 = Math.max(...results.map((r) => r.totalCo2));

  // Calculate savings compared to BBM
  const bbmResult = results.find((r) => r.id === 'bbm');
  const bbmCostObj = bbmResult ? bbmResult.totalCost : 0;
  const bbmCo2Obj = bbmResult ? bbmResult.totalCo2 : 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatCo2 = (val: number) => {
    return `${val.toLocaleString('id-ID', { maximumFractionDigits: 1 })} kg CO₂`;
  };

  const getTimeframeLabel = () => {
    if (timeframe === 'monthly') return 'Per Bulan';
    if (timeframe === 'yearly') return 'Per Tahun';
    return `Selama ${state.ownershipYears} Tahun`;
  };

  return (
    <div className="bg-[#0f172a]/60 backdrop-blur-xs rounded-2xl p-6 border border-slate-800 shadow-[0_0_20px_rgba(255,255,255,0.01)] space-y-6" id="visual-chart-container">
      {/* Header and Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-white" id="chart-main-title">
            Visualisasi &amp; Perbandingan Instan
          </h2>
          <p className="text-xs text-slate-400">
            Analisis perbandingan biaya riil dan dampak emisi karbon kendaraan Anda.
          </p>
        </div>

        {/* Financial / Environmental Selector */}
        <div className="flex bg-[#020617] border border-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('financial')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold select-none cursor-pointer transition-colors ${
              activeTab === 'financial'
                ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-450 font-bold shadow-xs'
                : 'text-slate-450 hover:text-white border border-transparent'
            }`}
            id="tab-financial"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Biaya Kepemilikan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('environmental')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold select-none cursor-pointer transition-colors ${
              activeTab === 'environmental'
                ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-bold shadow-xs'
                : 'text-slate-450 hover:text-white border border-transparent'
            }`}
            id="tab-environmental"
          >
            <Leaf className="w-3.5 h-3.5" />
            Dampak Karbon
          </button>
        </div>
      </div>

      {/* Timeframe Selectors */}
      <div className="flex justify-between items-center bg-[#020617] border border-slate-800/80 p-2 rounded-xl">
        <span className="text-xs font-medium text-slate-400 pl-2">
          Rentang Analisis:
        </span>
        <div className="flex space-x-1">
          {(['monthly', 'yearly', 'lifetime'] as const).map((t) => (
            <button
              key={t}
              id={`btn-timeframe-${t}`}
              type="button"
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg select-none cursor-pointer transition-all ${
                timeframe === t
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-950/50 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              {t === 'monthly' ? 'Bulanan' : t === 'yearly' ? 'Tahunan' : `${state.ownershipYears} Tahun`}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'financial' ? (
          <motion.div
            key="financial"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {results.map((car) => {
                const percentage = maxCost > 0 ? (car.totalCost / maxCost) * 100 : 0;
                const isCheapest = car.id === minCostItem.id;
                const savingsVsBbm = bbmCostObj - car.totalCost;

                return (
                  <div key={car.id} id={`chart-row-${car.id}`} className="space-y-1.5 group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: car.color }}
                        />
                        <span className="font-semibold text-slate-200">
                          {car.shortName}
                        </span>
                        {isCheapest && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-300 bg-emerald-950/65 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/20">
                            <Award className="w-2.5 h-2.5 mr-0.5 text-emerald-400" /> Terhemat
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline space-x-1.5 sm:text-right">
                        <span className="font-bold font-mono text-white text-md">
                          {formatCurrency(car.totalCost)}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide font-mono">
                          {getTimeframeLabel()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className={`relative w-full h-8 bg-[#020617] rounded-lg overflow-hidden flex items-center pr-2 border ${isCheapest ? 'border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.08)]' : 'border-slate-800'}`}>
                      <motion.div
                        className="h-full absolute left-0 top-0 transition-colors"
                        style={{
                          backgroundColor: car.color,
                          opacity: 0.85,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />

                      {/* Content Overlay */}
                      <div className="absolute inset-x-3 flex justify-between items-center text-xs text-white z-10 pointer-events-none drop-shadow-sm font-mono font-bold">
                        <span className="font-bold truncate max-w-[70%]">
                          {formatCurrency(car.costPerKm)}/km
                          {state.useCustomParams && car.fixedCostTotal > 0 && (
                            <span className="text-[10px] opacity-90 pl-1 font-sans font-normal">
                              (+{formatCurrency(car.fixedCostTotal / (timeframe === 'monthly' ? 1 : timeframe === 'yearly' ? 12 : state.ownershipYears * 12))}/bln tetap)
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Savings text showing compared to BBM */}
                      {car.id !== 'bbm' && savingsVsBbm > 0 && (
                        <div className="absolute right-3.5 z-10 bg-[#0f172a]/95 border border-emerald-500/30 p-1 px-2 rounded-md text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 shadow-md">
                          <ArrowDownRight className="w-3 h-3 text-emerald-450" />
                          Hemat {formatCurrency(savingsVsBbm)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Insight / Summary Banner */}
            {minCostItem.id !== 'bbm' && bbmCostObj > 0 && (
              <div className="p-4 bg-emerald-950/20 border border-emerald-555/20 rounded-xl flex items-start space-x-3">
                <div className="p-2 bg-emerald-900/30 rounded-lg text-emerald-450">
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Saran Ekonomis
                  </h3>
                  <p className="text-xs text-slate-350 mt-0.5 leading-relaxed">
                    Dengan beralih dari mobil BBM ke <strong>{minCostItem.name}</strong>, Anda berpotensi menghemat hingga <strong className="text-emerald-400 font-bold">{formatCurrency(bbmCostObj - minCostItem.totalCost)}</strong> {getTimeframeLabel().toLowerCase()}! Penghematan operasional ini dapat sepenuhnya melunasi perbedaan harga beli kendaraan dalam waktu singkat.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="environmental"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {results.map((car) => {
                const percentage = maxCo2 > 0 ? (car.totalCo2 / maxCo2) * 100 : 0;
                const isLowestEmission = car.category === 'listrik';
                const co2SavedVsBbm = bbmCo2Obj - car.totalCo2;

                return (
                  <div key={car.id} id={`chart-row-co2-${car.id}`} className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: isLowestEmission ? '#059669' : car.color }}
                        />
                        <span className="font-semibold text-slate-200">
                          {car.shortName}
                        </span>
                        {isLowestEmission && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-300 bg-emerald-950/65 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/20">
                            Ramah Lingkungan
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline space-x-1.5 sm:text-right">
                        <span className="font-bold font-mono text-white text-md">
                          {formatCo2(car.totalCo2)}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide font-mono">
                          {getTimeframeLabel()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className={`relative w-full h-8 bg-[#020617] rounded-lg overflow-hidden flex items-center pr-2 border ${isLowestEmission ? 'border-emerald-500/30' : 'border-slate-800'}`}>
                      <motion.div
                        className="h-full absolute left-0 top-0 transition-colors"
                        style={{
                          backgroundColor: isLowestEmission ? '#10b981' : car.color,
                          opacity: 0.8,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />

                      {/* Content Overlay */}
                      <div className="absolute inset-x-3 flex justify-between items-center text-xs text-white z-10 pointer-events-none drop-shadow-sm font-mono font-bold">
                        <span className="font-bold truncate">
                          {car.co2PerKm} g CO₂/km
                        </span>
                      </div>

                      {/* Emission reduction tag */}
                      {car.id !== 'bbm' && co2SavedVsBbm > 0 && (
                        <div className="absolute right-3.5 z-10 bg-[#0f172a]/95 border border-emerald-500/30 p-1 px-2 rounded-md text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 shadow-md">
                          <Leaf className="w-3 h-3 text-emerald-405" />
                          Serap {co2SavedVsBbm.toLocaleString('id-ID', { maximumFractionDigits: 1 })} kg CO₂
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Environmental Summary Box */}
            <div className="p-4 bg-teal-950/20 border border-teal-800/40 rounded-xl flex items-start space-x-3">
              <div className="p-2 bg-teal-900/30 rounded-lg text-emerald-400">
                <Leaf className="w-5 h-5 font-bold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Dampak Lingkungan Riil
                </h3>
                <p className="text-xs text-slate-350 mt-0.5 leading-relaxed">
                  Mobil Listrik menurunkan emisi gas rumah kaca harian secara signifikan. Dalam mode {getTimeframeLabel().toLowerCase()}, berkendara dengan mobil listrik menghemat sekitar <strong className="text-emerald-400">{(bbmCo2Obj - minCo2Item.totalCo2).toLocaleString('id-ID', { maximumFractionDigits: 0 })} kg emisi karbon</strong> dibanding mobil BBM konvensional — setara dengan menanam puluhan pohon baru!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
