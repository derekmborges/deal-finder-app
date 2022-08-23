
export enum SavingsCategory {
    ALL = 'All',
    TOOLS = 'Tool Savings',
    OUTDOOR_LIVING = 'Outdoor Living Savings',
    BATH_FAUCET = 'Bath & Faucet Savings',
    KITCHEN = 'Kitchen Savings',
    STORAGE = 'Storage Savings',
    HARDWARE = 'Hardware Savings',
    FLOORING_TILE = 'Flooring & Tile Savings',
    LAWN_GARDN = 'Lawn & Garden',
    PLUMBING = 'Plumbing Savings',
    LIGHTING_FAN = 'Lighting & Fan Savings',
    BUILDING_MATERIAL = 'Building Material Savings',
    ELECTRICAL = 'Electrical Savings',
    PAINT = 'Paint Savings',
    FURNITURE = 'Furniture Savings',
    BLINDS_WINDOW_TREATMENT = 'Blinds & Window Treatment Savings',
    HEATING_COOLING = 'Heating & Cooling Savings'
}

export interface SavedSearch {
    id: string;
    searchPhrase: string;
    categories: string[];
}