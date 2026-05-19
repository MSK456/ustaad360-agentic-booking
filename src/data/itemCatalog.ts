export interface CatalogItem {
  id: string;
  name: string;
  category: 'meat' | 'fruits_vegetables' | 'grocery';
  unit: string;
  unitPrice: number;
  aliases: string[];
}

export const ITEM_CATALOG: CatalogItem[] = [
  // MEAT
  { id: 'm1', name: 'Chicken', category: 'meat', unit: 'kg', unitPrice: 650, aliases: ['chicken', 'murghi'] },
  { id: 'm2', name: 'Beef', category: 'meat', unit: 'kg', unitPrice: 1200, aliases: ['beef', 'bada gosht', 'gosht'] },
  { id: 'm3', name: 'Mutton', category: 'meat', unit: 'kg', unitPrice: 2400, aliases: ['mutton', 'chota gosht', 'bakra'] },
  { id: 'm4', name: 'Qeema Chicken', category: 'meat', unit: 'kg', unitPrice: 750, aliases: ['qeema chicken', 'chicken qeema'] },
  { id: 'm5', name: 'Qeema Beef', category: 'meat', unit: 'kg', unitPrice: 1300, aliases: ['qeema beef', 'beef qeema', 'qeema'] },

  // FRUITS & VEG
  { id: 'fv1', name: 'Apple', category: 'fruits_vegetables', unit: 'kg', unitPrice: 350, aliases: ['apple', 'apples', 'saeb', 'seb'] },
  { id: 'fv2', name: 'Banana', category: 'fruits_vegetables', unit: 'dozen', unitPrice: 180, aliases: ['banana', 'bananas', 'kela', 'kele'] },
  { id: 'fv3', name: 'Orange', category: 'fruits_vegetables', unit: 'kg', unitPrice: 250, aliases: ['orange', 'oranges', 'malta', 'kino'] },
  { id: 'fv4', name: 'Potato', category: 'fruits_vegetables', unit: 'kg', unitPrice: 120, aliases: ['potato', 'potatoes', 'aloo'] },
  { id: 'fv5', name: 'Onion', category: 'fruits_vegetables', unit: 'kg', unitPrice: 140, aliases: ['onion', 'onions', 'pyaz', 'piyaz'] },
  { id: 'fv6', name: 'Tomato', category: 'fruits_vegetables', unit: 'kg', unitPrice: 160, aliases: ['tomato', 'tomatoes', 'tamatar'] },
  { id: 'fv7', name: 'Cucumber', category: 'fruits_vegetables', unit: 'kg', unitPrice: 120, aliases: ['cucumber', 'cucumbers', 'kheera'] },
  { id: 'fv8', name: 'Mixed Sabzi Pack', category: 'fruits_vegetables', unit: 'pack', unitPrice: 500, aliases: ['mixed sabzi', 'sabzi pack', 'sabzi'] },

  // GROCERY
  { id: 'g1', name: 'Atta 10kg', category: 'grocery', unit: 'pack', unitPrice: 1600, aliases: ['atta', 'flour'] },
  { id: 'g2', name: 'Rice 5kg', category: 'grocery', unit: 'pack', unitPrice: 1800, aliases: ['rice', 'chawal'] },
  { id: 'g3', name: 'Sugar 1kg', category: 'grocery', unit: 'kg', unitPrice: 180, aliases: ['sugar', 'cheeni'] },
  { id: 'g4', name: 'Cooking Oil 1L', category: 'grocery', unit: 'litre', unitPrice: 550, aliases: ['oil', 'cooking oil', 'teil'] },
  { id: 'g5', name: 'Daal 1kg', category: 'grocery', unit: 'kg', unitPrice: 400, aliases: ['daal', 'lentil', 'dal'] },
  { id: 'g6', name: 'Milk 1L', category: 'grocery', unit: 'litre', unitPrice: 250, aliases: ['milk', 'doodh'] },
  { id: 'g7', name: 'Eggs 1 Dozen', category: 'grocery', unit: 'dozen', unitPrice: 360, aliases: ['eggs', 'egg', 'anday', 'anda'] },
];
