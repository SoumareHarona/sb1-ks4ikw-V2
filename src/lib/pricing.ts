import { EUR_TO_XOF } from './constants';

export const RATES = {
  air: {
    food: 3,
    nonFood: 4.9,
    hn7: 7
  },
  sea: {
    volumeRate: 375,
    minVolume: 0.5,
    food: 2.5,
    nonFood: 4,
    hn7: 6
  },
  gp: {
    base: 50
  }
};

interface Weights {
  food?: number;
  nonFood?: number;
  hn7?: number;
}

interface Volume {
  length?: number;
  width?: number;
  height?: number;
}

interface AdvancePayment {
  amount: string;
  currency: 'EUR' | 'XOF';
}

interface PriceCalculation {
  baseAmountEUR: number;
  baseAmountXOF: number;
  advanceAmountEUR: number;
  advanceAmountXOF: number;
  remainingEUR: number;
  remainingXOF: number;
  paymentStatus: 'pending' | 'completed';
  details: {
    totalWeight: number;
    foodCost: number;
    nonFoodCost: number;
    hn7Cost: number;
    weightBasedCost: number;
    volumeBasedCost?: number;
    volume?: number;
    appliedMethod?: 'weight' | 'volume';
  };
}

export function calculatePrice(
  mode: string, 
  weights: Weights, 
  volume?: Volume,
  advancePayment?: AdvancePayment
): PriceCalculation {
  let baseAmountEUR = 0;
  const details = {
    totalWeight: 0,
    foodCost: 0,
    nonFoodCost: 0,
    hn7Cost: 0,
    weightBasedCost: 0,
    volumeBasedCost: undefined as number | undefined,
    volume: undefined as number | undefined,
    appliedMethod: undefined as 'weight' | 'volume' | undefined
  };

  // Calculate total weight
  details.totalWeight = (weights.food || 0) + (weights.nonFood || 0) + (weights.hn7 || 0);

  if (mode === 'air') {
    details.foodCost = (weights.food || 0) * RATES.air.food;
    details.nonFoodCost = (weights.nonFood || 0) * RATES.air.nonFood;
    details.hn7Cost = (weights.hn7 || 0) * RATES.air.hn7;
    details.weightBasedCost = details.foodCost + details.nonFoodCost + details.hn7Cost;
    baseAmountEUR = details.weightBasedCost;
  } 
  else if (mode === 'sea') {
    // Calculate volume-based cost
    if (volume?.length && volume.width && volume.height) {
      const volumeM3 = (volume.length * volume.width * volume.height) / 1000000;
      details.volume = Math.max(volumeM3, RATES.sea.minVolume);
      details.volumeBasedCost = details.volume * RATES.sea.volumeRate;
    }

    // Calculate weight-based cost
    details.foodCost = (weights.food || 0) * RATES.sea.food;
    details.nonFoodCost = (weights.nonFood || 0) * RATES.sea.nonFood;
    details.hn7Cost = (weights.hn7 || 0) * RATES.sea.hn7;
    details.weightBasedCost = details.foodCost + details.nonFoodCost + details.hn7Cost;

    // Use the higher of volume-based or weight-based cost
    if (details.volumeBasedCost && details.volumeBasedCost > details.weightBasedCost) {
      baseAmountEUR = details.volumeBasedCost;
      details.appliedMethod = 'volume';
    } else {
      baseAmountEUR = details.weightBasedCost;
      details.appliedMethod = 'weight';
    }
  } 
  else {
    // GP transport has a fixed base rate
    baseAmountEUR = RATES.gp.base;
  }

  const baseAmountXOF = Math.round(baseAmountEUR * EUR_TO_XOF);

  // Calculate advance payment
  let advanceAmountEUR = 0;
  let advanceAmountXOF = 0;

  if (advancePayment?.amount) {
    const amount = parseFloat(advancePayment.amount);
    if (!isNaN(amount) && amount > 0) {
      if (advancePayment.currency === 'EUR') {
        advanceAmountEUR = parseFloat(amount.toFixed(2));
        advanceAmountXOF = Math.round(amount * EUR_TO_XOF);
      } else {
        advanceAmountXOF = Math.round(amount);
        advanceAmountEUR = parseFloat((amount / EUR_TO_XOF).toFixed(2));
      }
    }
  }

  // Calculate remaining amounts
  const remainingEUR = Math.max(0, parseFloat((baseAmountEUR - advanceAmountEUR).toFixed(2)));
  const remainingXOF = Math.max(0, Math.round(baseAmountXOF - advanceAmountXOF));

  // Determine payment status with tolerance for floating-point precision
  const EPSILON = 0.01; // 1 cent tolerance for EUR
  const isFullyPaid = remainingEUR <= EPSILON || 
                     Math.abs(advanceAmountEUR - baseAmountEUR) <= EPSILON ||
                     Math.abs(advanceAmountXOF - baseAmountXOF) <= 1; // 1 XOF tolerance

  return {
    baseAmountEUR,
    baseAmountXOF,
    advanceAmountEUR,
    advanceAmountXOF,
    remainingEUR,
    remainingXOF,
    paymentStatus: isFullyPaid ? 'completed' : 'pending',
    details
  };
}