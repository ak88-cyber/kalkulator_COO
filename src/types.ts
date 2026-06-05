/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VehicleCategory = 'listrik' | 'hibrida' | 'bbm';

export interface VehicleConfig {
  id: string;
  name: string;
  category: VehicleCategory;
  costPerKm: number; // in IDR/Rupiah
  shortName: string;
  description: string;
  taxScenario: string;
  energyScenario: string;
  co2PerKm: number; // in grams of CO2 per km
  color: string; // Tailwind accent class color
  borderColor: string;
  bgColor: string;
}

export interface CalculatorState {
  dailyDistance: number;
  monthlyDistance: number;
  ownershipYears: number;
  useCustomParams: boolean;
  icvPercent: number; // customized cost percentage adjustments
  customCosts: {
    [vehicleId: string]: {
      cicilan: number; // cicilan bulanan
      perawatan: number; // perawatan & servis bulanan tambahan
      asuransi: number; // asuransi bulanan
    }
  };
}

export const VEHICLE_DATA: VehicleConfig[] = [
  {
    id: 'listrik_1',
    name: 'Mobil Listrik 1 (Insentif & Charge Rumah)',
    shortName: 'Listrik 1',
    category: 'listrik',
    costPerKm: 244,
    description: 'Skenario penggunaan mobil listrik dengan insentif pajak penuh dan pengisian daya di rumah dengan diskon 30% PLN (malam hari).',
    taxScenario: 'Bebas PKB / Pajak Insentif (0%)',
    energyScenario: 'Charge Rumah via Home Charger (Diskon 30% tarif malam PLN)',
    co2PerKm: 60,
    color: '#059669', // Emerald
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-50/50 dark:bg-emerald-950/20',
  },
  {
    id: 'listrik_2',
    name: 'Mobil Listrik 2 (PKB 100% & Charge Rumah)',
    shortName: 'Listrik 2',
    category: 'listrik',
    costPerKm: 971,
    description: 'Skenario penggunaan mobil listrik dengan membayar 100% Pajak Kendaraan Bermotor (PKB) dan pengisian daya di rumah dengan diskon 30% PLN.',
    taxScenario: 'Membayar PKB standard 100%',
    energyScenario: 'Charge Rumah via Home Charger (Diskon 30% tarif malam PLN)',
    co2PerKm: 60,
    color: '#10b981', // Emerald medium
    borderColor: 'border-teal-500',
    bgColor: 'bg-teal-50/50 dark:bg-teal-950/20',
  },
  {
    id: 'listrik_3',
    name: 'Mobil Listrik 3 (PKB 100% & Charge SPKLU)',
    shortName: 'Listrik 3',
    category: 'listrik',
    costPerKm: 1144,
    description: 'Skenario penggunaan mobil listrik dengan membayar PKB 100% dan pengisian daya sepenuhnya di SPKLU umum (tanpa diskon rumah).',
    taxScenario: 'Membayar PKB standard 100%',
    energyScenario: 'Murni menggunakan SPKLU Umum (Tarif Fast/Ultra Fast Charging)',
    co2PerKm: 60,
    color: '#3b82f6', // Blue
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50/50 dark:bg-blue-950/20',
  },
  {
    id: 'hibrida',
    name: 'Mobil Hibrida (Hybrid)',
    shortName: 'Hibrida',
    category: 'hibrida',
    costPerKm: 1323,
    description: 'Kendaraan hibrida yang memadukan kinerja mesin bensin konvensional dengan motor listrik dan pengereman regeneratif.',
    taxScenario: 'Pajak Kendaraan Bermotor Normal',
    energyScenario: 'Bahan bakar minyak + bantuan baterai hibrida otomatis',
    co2PerKm: 110,
    color: '#f59e0b', // Amber
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-50/50 dark:bg-amber-950/20',
  },
  {
    id: 'bbm',
    name: 'Mobil Bahan Bakar Minyak (BBM)',
    shortName: 'Mobil BBM',
    category: 'bbm',
    costPerKm: 1664,
    description: 'Kendaraan konvensional bermesin pembakaran dalam yang sepenuhnya menggunakan bahan bakar minyak (Petroleum/Gasoline).',
    taxScenario: 'Pajak Kendaraan Bermotor Normal',
    energyScenario: 'Konsumsi BBM konvensional (Petrol/Diesel)',
    co2PerKm: 180,
    color: '#ef4444', // Red
    borderColor: 'border-red-500',
    bgColor: 'bg-red-50/50 dark:bg-red-950/20',
  }
];
