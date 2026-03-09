export const getCurrencySymbol = (currencyCode: string): string => {
    switch (currencyCode) {
        case 'USD': return '$';
        case 'EUR': return '€';
        case 'GBP': return '£';
        case 'KES': return 'KSh';
        default: return currencyCode;
    }
};

export const formatYAxis = (tickItem: number): string => `${tickItem}`;

export const toMonthString = (date: Date): string =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
