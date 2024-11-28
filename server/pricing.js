export const EUR_TO_XOF = 655.957;

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

export function calculatePrice(mode, weights, dimensions) {
  let baseAmountEUR = 0;
  const details = {
    totalWeight: 0,
    foodCost: 0,
    nonFoodCost: 0,
    hn7Cost: 0,
    weightBasedCost: 0,
    volumeBasedCost: undefined,
    volume: undefined,
    appliedMethod: undefined
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
    if (dimensions?.length && dimensions.width && dimensions.height) {
      const volume = (dimensions.length * dimensions.width * dimensions.height) / 1000000;
      details.volume = Math.max(volume, RATES.sea.minVolume);
      details.volumeBasedCost = details.volume * RATES.sea.volumeRate;
    }

    // Calculate weight-based cost
    details.foodCost = (weights.food || 0) * RATES.sea.food;
    details.nonFoodCost = (weights.nonFood || 0) * RATES.sea.nonFood;
    details.hn7Cost = (weights.hn7 || 0) * RATES.sea.hn7;
    details.weightBasedCost = details.foodCost + details.nonFoodCost + details.hn7Cost;

    // Use the higher of volume or weight based cost
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

  return {
    baseAmountEUR,
    baseAmountXOF: Math.round(baseAmountEUR * EUR_TO_XOF),
    details
  };
}