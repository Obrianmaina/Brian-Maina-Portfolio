"use client";

import { useMemo } from "react";
import { Transaction, Rates, TaxSummary, MonthlyStats, ChartDataPoint, CurrencyCode } from "../types";

export function useEstimatedPayout(
    amount: string,
    currency: CurrencyCode,
    rates: Rates,
    hasWHT: boolean,
    docType: string
): number {
    return useMemo(() => {
        const rawAmount = parseFloat(amount) || 0;
        const whtDeduction = hasWHT && docType !== 'expense' ? rawAmount * 0.05 : 0;
        const netClientPayment = rawAmount - whtDeduction;
        const currentRate = rates[currency] || 1;
        const grossKES = netClientPayment * currentRate;
        const feePercentage = currency === "KES" ? 0.015 : 0.038;
        return grossKES - grossKES * feePercentage;
    }, [amount, rates, currency, hasWHT, docType]);
}

export function useTaxSummary(transactions: Transaction[], rates: Rates): TaxSummary {
    return useMemo(() => {
        let grossRevenueKES = 0;
        let totalExpensesKES = 0;
        let totalWithheldTaxKES = 0;

        const currentYear = new Date().getFullYear();

        transactions.forEach(tx => {
            if (new Date(tx.date).getFullYear() !== currentYear) return;

            const txAmount = parseFloat(String(tx.amount));
            const txRate = rates[tx.currency || 'EUR'] || 1;
            const amountInKES = tx.status === 'paid' && tx.amountPaidKES
                ? tx.amountPaidKES
                : txAmount * txRate;
            const whtInKES = (tx.withholdingTax ? parseFloat(String(tx.withholdingTax)) : 0) * txRate;

            if (tx.status === 'paid' && tx.type !== 'expense') {
                grossRevenueKES += amountInKES;
                totalWithheldTaxKES += whtInKES;
            } else if (tx.type === 'expense') {
                totalExpensesKES += amountInKES;
            }
        });

        const netProfit = grossRevenueKES - totalExpensesKES;
        const TAX_EXEMPT_CLAUSE = 288000;
        const taxableIncome = Math.max(0, netProfit - TAX_EXEMPT_CLAUSE);
        const grossTax = taxableIncome * 0.30;
        const estimatedTaxDue = Math.max(0, grossTax - totalWithheldTaxKES);
        const totalTitheKES = grossRevenueKES * 0.10;
        const freeToSpendKES = netProfit - estimatedTaxDue - totalTitheKES;

        return {
            grossRevenueKES, totalExpensesKES, netProfit,
            taxableIncome, totalWithheldTaxKES, estimatedTaxDue,
            totalTitheKES, freeToSpendKES,
        };
    }, [transactions, rates]);
}

export function useAllChartData(transactions: Transaction[], rates: Rates): ChartDataPoint[] {
    return useMemo(() => {
        const paid = transactions.filter(t => t.status === 'paid' && t.type !== 'expense');
        const grouped = paid.reduce((acc: Record<string, number>, curr) => {
            const dateStr = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            if (!acc[dateStr]) acc[dateStr] = 0;
            const amt = parseFloat(String(curr.amount));
            const txRate = rates[curr.currency || 'EUR'] || 1;
            acc[dateStr] += curr.amountPaidKES ?? amt * txRate;
            return acc;
        }, {});

        let data = Object.keys(grouped).map(date => ({ date, revenue: grouped[date] })).reverse();
        if (data.length === 1) {
            const dayBefore = new Date(data[0].date);
            dayBefore.setDate(dayBefore.getDate() - 1);
            data = [{ date: dayBefore.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), revenue: 0 }, ...data];
        }
        return data;
    }, [transactions, rates]);
}

export function useMonthlyData(
    transactions: Transaction[],
    rates: Rates,
    reportMonth: string
) {
    const monthlyTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const d = new Date(tx.date);
            const txMonthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            return txMonthStr === reportMonth;
        });
    }, [transactions, reportMonth]);

    const monthlyChartData = useMemo((): ChartDataPoint[] => {
        const paid = monthlyTransactions.filter(t => t.status === 'paid' && t.type !== 'expense');
        const grouped = paid.reduce((acc: Record<string, number>, curr) => {
            const dateStr = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!acc[dateStr]) acc[dateStr] = 0;
            const amt = parseFloat(String(curr.amount));
            const txRate = rates[curr.currency || 'EUR'] || 1;
            acc[dateStr] += curr.amountPaidKES ?? amt * txRate;
            return acc;
        }, {});

        let data = Object.keys(grouped).map(date => ({ date, revenue: grouped[date] })).reverse();
        if (data.length === 1) data = [{ date: "Start", revenue: 0 }, ...data];
        return data;
    }, [monthlyTransactions, rates]);

    const monthlyStats = useMemo((): MonthlyStats => {
        let billed = 0, collected = 0, pending = 0, expenses = 0, wht = 0;

        monthlyTransactions.forEach(tx => {
            const amt = parseFloat(String(tx.amount));
            const txRate = rates[tx.currency || 'EUR'] || 1;
            const estimatedKES = amt * txRate;
            const exactPaidKES = tx.amountPaidKES ?? estimatedKES;
            const whtKES = (parseFloat(String(tx.withholdingTax || 0))) * txRate;

            if (tx.type === 'expense') {
                expenses += exactPaidKES;
            } else if (tx.type === 'invoice') {
                billed += estimatedKES;
                if (tx.status === 'pending') pending += estimatedKES;
            }

            if (tx.status === 'paid' && tx.type !== 'expense') {
                collected += exactPaidKES;
                wht += whtKES;
            }
        });

        const netProfit = collected - expenses;
        const taxableIncome = Math.max(0, netProfit - 24000);
        const estimatedTax = Math.max(0, taxableIncome * 0.30 - wht);
        const tithe = collected * 0.10;
        const freeToSpend = netProfit - estimatedTax - tithe;

        return { billed, collected, pending, expenses, estimatedTax, tithe, freeToSpend };
    }, [monthlyTransactions, rates]);

    return { monthlyTransactions, monthlyChartData, monthlyStats };
}
