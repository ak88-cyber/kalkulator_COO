/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculatorState, VEHICLE_DATA } from '../types';
import { Target, Smile, Heart, Leaf, Coffee, Globe, Compass, ArrowRightLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface SavingsEstimatorProps {
  state: CalculatorState;
}

export default function SavingsEstimator({ state }: SavingsEstimatorProps) {
  const kmPerMonth = state.monthlyDistance;

  // Let's compare cheapest EV (listrik_1) with BBM
  const listrik1 = VEHICLE_DATA.find((v) => v.id === 'listrik_1')!;
  const bbm = VEHICLE_DATA.find((v) => v.id === 'bbm')!;

  const costListrik1PerMonth = kmPerMonth * listrik1.costPerKm;
  const costBbmPerMonth = kmPerMonth * bbm.costPerKm;

  // Monthly custom fixed costs (if custom calculations enabled)
  const listrik1Custom = state.customCosts[listrik1.id] || { cicilan: 0, perawatan: 0, asuransi: 0 };
  const bbmCustom = state.customCosts[bbm.id] || { cicilan: 0, perawatan: 0, asuransi: 0 };

  const totalListrik1PerMonth = costListrik1PerMonth + (state.useCustomParams ? (listrik1Custom.cicilan + listrik1Custom.asuransi + listrik1Custom.perawatan) : 0);
  const totalBbmPerMonth = costBbmPerMonth + (state.useCustomParams ? (bbmCustom.cicilan + bbmCustom.asuransi + bbmCustom.perawatan) : 0);

  const monthlySavings = Math.max(0, totalBbmPerMonth - totalListrik1PerMonth);
  const yearlySavings = monthlySavings * 12;
  const lifetimeSavings = yearlySavings * state.ownershipYears;

  // Environmental
  const co2Listrik1PerKm = listrik1.co2PerKm;
  const co2BbmPerKm = bbm.co2PerKm;
  const co2SavedPerMonthKg = (kmPerMonth * (co2BbmPerKm - co2Listrik1PerKm)) / 1000;
  const co2SavedLifetimeKg = co2SavedPerMonthKg * 12 * state.ownershipYears;

  // Visual Metaphors
  const coffeeCupCost = 25000; // Rp 25.000 per cup of Kopi Susu
  const equivalentCoffeeCups = Math.floor(monthlySavings / coffeeCupCost);

  const electricScooterCharge = 2000; // Rp 2000 to charge phone / tablet
  const equivalentGadgetCharges = Math.floor(monthlySavings / electricScooterCharge);

  const co2AbsorbedPerTreeYearKg = 22; // A mature tree absorbs ~22kg of CO2 per year
  const equivalentTreesPlanted = Math.ceil(co2SavedLifetimeKg / co2AbsorbedPerTreeYearKg);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-[#0f172a]/60 backdrop-blur-xs text-white rounded-2xl p-6 border border-slate-800 shadow-[0_0_20px_rgba(255,255,255,0.01)] space-y-6" id="savings-estimator-container">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-5">
        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
          <Target className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display text-white" id="estimator-title">
            Potensi Keuntungan Finansial &amp; Hijau
          </h2>
          <p className="text-xs text-slate-400">
            Simulasi keuntungan jika Anda memilih skenario mobil listrik paling optimal (Mobil Listrik 1) dibandingkan mobil BBM konvensional.
          </p>
        </div>
      </div>

      {/* Main Metric Spotlight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bulanan */}
        <div className="bg-[#020617]/50 p-4.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Penghematan Bulanan
          </span>
          <div className="mt-3">
            <span className="text-2xl font-black font-mono text-cyan-400">
              {formatCurrency(monthlySavings)}
            </span>
            <span className="text-xs text-slate-550">/bln</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            Dihitung dari jarak {kmPerMonth.toLocaleString('id-ID')} km/bulan.
          </p>
        </div>

        {/* Tahunan */}
        <div className="bg-[#020617]/50 p-4.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Penghematan Tahunan
          </span>
          <div className="mt-3">
            <span className="text-2xl font-black font-mono text-emerald-300">
              {formatCurrency(yearlySavings)}
            </span>
            <span className="text-xs text-slate-550">/tahun</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            Sama dengan memotong pengeluaran bahan bakar yang membengkak.
          </p>
        </div>

        {/* Total Terakumulasi */}
        <div className="bg-[#020617]/60 p-4.5 rounded-xl border border-emerald-500/20 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle green ambient light */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
            Total Proyeksi {state.ownershipYears} Tahun
          </span>
          <div className="mt-3 z-10">
            <span className="text-2xl font-black font-mono text-white">
              {formatCurrency(lifetimeSavings)}
            </span>
            <span className="text-xs text-slate-400 font-bold"> total</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-medium mt-2 leading-relaxed flex items-center gap-1">
            <Smile className="w-3.5 h-3.5" /> Akumulasi tabungan masa depan!
          </p>
        </div>
      </div>

      {/* Visual Metaphor / Equivalent Section */}
      {monthlySavings > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 font-mono">
            Seberapa Berharga Sisa Dana Bulanan Anda?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="metaphor-grid">
            {/* Coffee Cups Metaphor */}
            <div className="bg-[#020617]/40 p-4 rounded-xl border border-slate-800 flex items-center space-x-3.5">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black font-mono text-white">{equivalentCoffeeCups} Cup</div>
                <div className="text-[10px] text-slate-400">Kopi Kekinian (Rp 25rb) per bulan</div>
              </div>
            </div>

            {/* Trees Metaphor */}
            <div className="bg-[#020617]/40 p-4 rounded-xl border border-slate-805 flex items-center space-x-3.5">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black font-mono text-white">~{equivalentTreesPlanted} Pohon</div>
                <div className="text-[10px] text-slate-400">Setara serapan emisi karbon {state.ownershipYears} tahun</div>
              </div>
            </div>

            {/* Gadget Metaphor */}
            <div className="bg-[#020617]/40 p-4 rounded-xl border border-slate-805 flex items-center space-x-3.5">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black font-mono text-white">
                  {(co2SavedLifetimeKg / 10).toLocaleString('id-ID', { maximumFractionDigits: 0 })} Hari
                </div>
                <div className="text-[10px] text-slate-400">Bebas polusi aktivitas rumah tangga biasa</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick comparison disclaimer banner */}
      <div className="p-3.5 bg-[#020617] rounded-xl text-[11px] text-slate-400 flex items-center gap-2 border border-slate-800/80">
        <ArrowRightLeft className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Skenario di atas didasarkan pada biaya tarif kilometer terpasang: <strong>Mobil Listrik 1 (Rp 244/km)</strong> vs <strong>Mobil BBM (Rp 1.664/km)</strong>. Skenario penggunaan pengisian SPKLU umum memiliki selisih angka yang disesuaikan dalam kartu perbandingan di bawah.
        </span>
      </div>
    </div>
  );
}
