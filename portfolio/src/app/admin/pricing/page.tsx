'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Send, Save, Edit } from 'lucide-react';
import AdminModal from '@/components/AdminModal';
import { Card, CardContent } from '@/components/ui/card';
import { PricingList, PricingItem } from '@/types';

export default function PricingPage() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [pricingLists, setPricingLists] = useState<PricingList[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [tax, setTax] = useState(0);
  const [items, setItems] = useState<PricingItem[]>([{ name: '', description: '', unitPrice: 0, quantity: 1, total: 0 }]);

  const [modal, setModal] = useState({ show: false, type: 'success' as 'success' | 'error' | 'confirm', title: '', message: '', onConfirm: undefined as undefined | (() => void) });

  useEffect(() => { fetchPricingLists(); }, []);

  const fetchPricingLists = async () => {
    try {
      const res = await fetch('/api/admin/pricing');
      if (res.ok) {
        const data = await res.json();
        setPricingLists(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch', error);
    }
  };

  const showModal = (type: 'success' | 'error' | 'confirm', title: string, message: string, onConfirm?: () => void) => {
    setModal({ show: true, type, title, message, onConfirm });
  };
  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  const resetEditor = () => {
    setEditingId(null);
    setTitle('');
    setClientName('');
    setClientEmail('');
    setCurrency('USD');
    setTax(0);
    setItems([{ name: '', description: '', unitPrice: 0, quantity: 1, total: 0 }]);
  };

  // ── Edit: populate the editor with existing data ──
  const handleEdit = (list: PricingList) => {
    setEditingId(list._id ?? null);
    setTitle(list.title);
    setClientName(list.clientName);
    setClientEmail(list.clientEmail);
    setCurrency(list.currency);
    setTax(list.tax);
    setItems(list.items);
    setView('editor');
  };

  const handleItemChange = (index: number, field: keyof PricingItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    newItems[index].total = newItems[index].unitPrice * newItems[index].quantity;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { name: '', description: '', unitPrice: 0, quantity: 1, total: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const totalAmount = subtotal + (subtotal * (tax / 100));

  // ── Save: POST for new, PUT for existing ──
  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { title, clientName, clientEmail, currency, tax, items, subtotal, totalAmount };

      let res: Response;
      if (editingId) {
        res = await fetch('/api/admin/pricing', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        res = await fetch('/api/admin/pricing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        showModal('success', 'Saved', editingId ? 'Pricing list updated successfully.' : 'Pricing list saved successfully.');
        resetEditor();
        setView('list');
        fetchPricingLists();
      } else {
        showModal('error', 'Error', 'Failed to save pricing list.');
      }
    } catch {
      showModal('error', 'Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // ── Delete with confirmation ──
  const handleDelete = (list: PricingList) => {
    showModal('confirm', 'Delete Pricing List', `Are you sure you want to delete "${list.title}"? This cannot be undone.`, async () => {
      closeModal();
      setLoading(true);
      try {
        const res = await fetch('/api/admin/pricing', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: list._id }),
        });

        if (res.ok) {
          setPricingLists(prev => prev.filter(p => p._id !== list._id));
          showModal('success', 'Deleted', 'Pricing list deleted successfully.');
        } else {
          showModal('error', 'Error', 'Failed to delete pricing list.');
        }
      } catch {
        showModal('error', 'Error', 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    });
  };

  // ── Send email and update local status to 'Sent' ──
  const handleSendEmail = async (list: PricingList) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pricing/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId: list._id }),
      });

      if (res.ok) {
        // Update local state so the badge flips immediately without a refetch
        setPricingLists(prev =>
          prev.map(p => p._id === list._id ? { ...p, status: 'sent' as const } : p)
        );
        showModal('success', 'Sent', `Pricing list sent to ${list.clientEmail}`);
      } else {
        showModal('error', 'Error', 'Failed to send email.');
      }
    } catch {
      showModal('error', 'Error', 'Failed to send email.');
    } finally {
      setLoading(false);
    }
  };

  // ── Badge colour: Draft = grey, Sent = teal ──
  const statusBadge = (status: string = 'Draft') => {
    const isSent = status === 'sent';
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full mb-4 inline-block ${isSent ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'}`}>
        {isSent ? 'Sent' : (status === 'draft' ? 'Draft' : status)}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {view === 'list' && (
          <div className="fade-in">
            <button onClick={() => router.push('/admin')} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium">
              <ArrowLeft size={20} className="mr-2" /> Back to Hub
            </button>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-l-4 border-teal-500 pb-2 px-4 gap-4">
              <h1 className="text-3xl font-bold">Pricing Lists</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create new card */}
              <div onClick={() => { resetEditor(); setView('editor'); }} className="border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-teal-50 hover:border-teal-500 rounded-2xl flex flex-col items-center justify-center min-h-[250px] cursor-pointer transition-colors group">
                <Plus size={32} className="text-gray-400 group-hover:text-teal-600 mb-4" />
                <p className="font-semibold text-gray-600 group-hover:text-teal-700">Create New List</p>
              </div>

              {pricingLists.map((list) => (
                <Card key={list._id} className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow p-6">
                  <div className="flex-grow">
                    {statusBadge(list.status)}
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{list.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">For: {list.clientName}</p>
                    <div className="text-2xl font-bold text-teal-600 mb-4">{list.currency} {list.totalAmount.toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleSendEmail(list)} disabled={loading} className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium transition-colors disabled:opacity-50">
                        <Send size={16} className="mr-1" /> Send
                      </button>
                      <button onClick={() => handleEdit(list)} className="text-teal-600 hover:text-teal-800 flex items-center text-sm font-medium transition-colors">
                        <Edit size={16} className="mr-1" /> Edit
                      </button>
                    </div>
                    <button onClick={() => handleDelete(list)} disabled={loading} className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium transition-colors disabled:opacity-50">
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {view === 'editor' && (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 fade-in">
            <button onClick={() => { resetEditor(); setView('list'); }} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium">
              <ArrowLeft size={20} className="mr-2" /> Back to Lists
            </button>
            <h2 className="text-3xl font-bold mb-8 border-l-4 border-teal-300 pb-2 px-4">
              {editingId ? 'Edit Pricing List' : 'New Pricing List'}
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 ml-1">Project / List Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1" placeholder="e.g. Website Redesign" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 ml-1">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="KES">KES</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 ml-1">Client Name</label>
                  <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1" placeholder="Client Name" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 ml-1">Client Email</label>
                  <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1" placeholder="client@example.com" />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-bold text-lg mb-4">Line Items</h3>
                {items.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 bg-gray-50 p-4 rounded-xl relative group">
                    <div className="flex-grow">
                      <input type="text" placeholder="Item Name" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg mb-2" />
                      <input type="text" placeholder="Short Description (optional)" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div className="w-full md:w-32">
                      <input type="number" placeholder="Price" value={item.unitPrice || ''} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="w-full md:w-24">
                      <input type="number" placeholder="Qty" value={item.quantity || ''} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="w-full md:w-32 flex items-center font-bold text-gray-700">
                      {currency} {item.total.toFixed(2)}
                    </div>
                    <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={20} /></button>
                  </div>
                ))}
                <button onClick={addItem} className="text-teal-600 font-bold flex items-center hover:text-teal-800 transition-colors"><Plus size={18} className="mr-1" /> Add Item</button>
              </div>

              <div className="pt-6 border-t border-gray-100 flex flex-col items-end">
                <div className="w-full md:w-1/2 space-y-2 text-right text-gray-700">
                  <div className="flex justify-between"><span>Subtotal:</span> <span>{currency} {subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between items-center">
                    <span>Tax (%):</span>
                    <input type="number" value={tax} onChange={(e) => setTax(parseFloat(e.target.value) || 0)} className="w-20 p-1 border border-gray-300 rounded text-right" />
                  </div>
                  <div className="flex justify-between font-bold text-xl text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total:</span> <span>{currency} {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button onClick={handleSave} disabled={loading} className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 flex justify-center items-center transition-all disabled:opacity-50">
                  <Save size={18} className="mr-2" /> {loading ? 'Saving...' : editingId ? 'Update Pricing List' : 'Save Pricing List'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}