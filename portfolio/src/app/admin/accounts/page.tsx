"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminModal from "@/components/AdminModal";

import { ActiveTab, DocType, CurrencyCode, ModalState } from "./types";
import { toMonthString } from "./utils";
import { useTransactions } from "./hooks/useTransactions";
import { useEstimatedPayout, useTaxSummary, useAllChartData, useMonthlyData } from "./hooks/useFinancials";
import DashboardTab from "./components/DashboardTab";
import ReportsTab from "./components/ReportsTab";

export default function AccountsPage() {
    const router = useRouter();

    // UI state
    const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
    const [loading, setLoading] = useState(false);
    const [markingPaid, setMarkingPaid] = useState<string | null>(null);
    const [modal, setModal] = useState<ModalState>({ show: false, type: 'success', title: '', message: '' });

    // Form state
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState<CurrencyCode>("USD");
    const [serviceDescription, setServiceDescription] = useState("");
    const [mpesaMessage, setMpesaMessage] = useState("");
    const [docType, setDocType] = useState<DocType>('invoice');
    const [expenseCategory, setExpenseCategory] = useState("software");
    const [hasWHT, setHasWHT] = useState(false);
    const [reportMonth, setReportMonth] = useState(() => toMonthString(new Date()));

    // Data hooks
    const { transactions, rates, isFetchingRates, fetchTransactions } = useTransactions();

    // Computed values
    const estimatedPayoutKES = useEstimatedPayout(amount, currency, rates, hasWHT, docType);
    const taxSummary = useTaxSummary(transactions, rates);
    const allChartData = useAllChartData(transactions, rates);
    const { monthlyTransactions, monthlyChartData, monthlyStats } = useMonthlyData(transactions, rates, reportMonth);

    // Helpers
    const showModal = (type: ModalState['type'], title: string, message: string, onConfirm?: () => void) =>
        setModal({ show: true, type, title, message, onConfirm });
    const closeModal = () => setModal(prev => ({ ...prev, show: false }));

    const handleDownloadKRA = () =>
        window.open(`/api/admin/accounts/export?year=${new Date().getFullYear()}`, '_blank');

    const resetForm = () => {
        setClientName(""); setClientEmail(""); setAmount("");
        setServiceDescription(""); setMpesaMessage("");
        setDocType('invoice'); setHasWHT(false);
    };

    const handleSendDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientName || !amount || !serviceDescription || (docType === 'receipt' && !mpesaMessage)) {
            return showModal('error', 'Incomplete', 'All required fields must be filled.');
        }
        if (docType !== 'expense' && !clientEmail) {
            return showModal('error', 'Incomplete', 'Client email is required for invoices and receipts.');
        }

        const whtAmount = hasWHT && docType !== 'expense' ? parseFloat(amount) * 0.05 : 0;
        setLoading(true);
        try {
            const res = await fetch("/api/admin/accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientName,
                    clientEmail: docType === 'expense' ? undefined : clientEmail,
                    amount: parseFloat(amount),
                    currency,
                    description: serviceDescription,
                    type: docType,
                    mpesaMessage: docType === 'receipt' ? mpesaMessage : undefined,
                    expenseCategory: docType === 'expense' ? expenseCategory : undefined,
                    withholdingTax: whtAmount,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                showModal('success', 'Success!', `The ${docType} was successfully processed.`);
                resetForm();
                fetchTransactions();
            } else {
                showModal('error', 'Failed', data.error || "Could not process the document.");
            }
        } catch {
            showModal('error', 'Error', "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsPaid = (id: string) => {
        showModal('confirm', 'Update Payment Status',
            'Are you sure you want to mark this invoice as paid? This will update your financial records immediately.',
            async () => {
                setMarkingPaid(id);
                try {
                    const res = await fetch("/api/admin/accounts", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id }),
                    });
                    if (res.ok) {
                        fetchTransactions();
                        showModal('success', 'Update Successful', 'The invoice has been marked as paid.');
                    } else {
                        showModal('error', 'Update Failed', 'Could not update the invoice status.');
                    }
                } catch {
                    showModal('error', 'Error', 'An unexpected error occurred.');
                } finally {
                    setMarkingPaid(null);
                }
            }
        );
    };

    // Shared props for both tabs
    const markPaidProps = { markingPaid, onMarkAsPaid: handleMarkAsPaid };

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 fade-in">

                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => router.push('/admin')}
                        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to Hub
                    </button>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-gray-200 gap-4">
                    <h2 className="text-3xl font-bold border-l-4 border-amber-400 pl-4 text-gray-800">
                        Financial Hub
                    </h2>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {(['dashboard', 'report'] as ActiveTab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab === 'dashboard' ? 'Dashboard' : 'Reports & Tax'}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'dashboard' ? (
                    <DashboardTab
                        allChartData={allChartData}
                        transactions={transactions}
                        {...markPaidProps}
                        docType={docType} setDocType={setDocType}
                        clientName={clientName} setClientName={setClientName}
                        clientEmail={clientEmail} setClientEmail={setClientEmail}
                        amount={amount} setAmount={setAmount}
                        currency={currency} setCurrency={setCurrency}
                        serviceDescription={serviceDescription} setServiceDescription={setServiceDescription}
                        mpesaMessage={mpesaMessage} setMpesaMessage={setMpesaMessage}
                        expenseCategory={expenseCategory} setExpenseCategory={setExpenseCategory}
                        hasWHT={hasWHT} setHasWHT={setHasWHT}
                        rates={rates}
                        isFetchingRates={isFetchingRates}
                        estimatedPayoutKES={estimatedPayoutKES}
                        loading={loading}
                        onSubmit={handleSendDocument}
                    />
                ) : (
                    <ReportsTab
                        taxSummary={taxSummary}
                        monthlyStats={monthlyStats}
                        monthlyTransactions={monthlyTransactions}
                        monthlyChartData={monthlyChartData}
                        reportMonth={reportMonth}
                        setReportMonth={setReportMonth}
                        rates={rates}
                        {...markPaidProps}
                        onDownloadKRA={handleDownloadKRA}
                    />
                )}
            </div>
            <AdminModal modal={modal} close={closeModal} />
        </main>
    );
}
