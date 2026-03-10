'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, UserCog } from 'lucide-react';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    name: '',
    email: '', 
    bio: '', 
    avatarUrl: '',
    oldPassword: '', 
    newPassword: '', 
    authenticatorCode: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      if (res.ok) {
        alert("Settings updated successfully!");
        setForm({ ...form, oldPassword: '', newPassword: '', authenticatorCode: '' });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <button 
        onClick={() => router.push('/admin')} 
        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium mb-6"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Hub
      </button>

      <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>
      
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4 text-teal-600">
          <UserCog size={20} />
          <h2 className="font-bold">Profile Settings</h2>
        </div>
        <div className="space-y-4">
          <input 
            type="text" placeholder="Display Name" className="w-full p-3 border rounded-xl"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Contact Email" className="w-full p-3 border rounded-xl"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
          <input 
            type="text" placeholder="Cloudinary Avatar URL" className="w-full p-3 border rounded-xl"
            value={form.avatarUrl}
            onChange={(e) => setForm({...form, avatarUrl: e.target.value})}
          />
          <textarea 
            placeholder="Admin Bio" className="w-full p-3 border rounded-xl h-24"
            value={form.bio}
            onChange={(e) => setForm({...form, bio: e.target.value})}
          />
        </div>
      </Card>

      <Card className="p-6 mb-8 border-orange-100 bg-orange-50/30">
        <div className="flex items-center gap-2 mb-4 text-orange-600">
          <ShieldCheck size={20} />
          <h2 className="font-bold">Security</h2>
        </div>
        <div className="space-y-4">
          <input 
            type="password" placeholder="Current Password" 
            className="w-full p-3 border border-orange-200 rounded-xl"
            value={form.oldPassword}
            onChange={(e) => setForm({...form, oldPassword: e.target.value})}
          />
          <input 
            type="text" placeholder="6-Digit Authenticator Code" maxLength={6}
            className="w-full p-3 border border-orange-200 rounded-xl tracking-widest"
            value={form.authenticatorCode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setForm({...form, authenticatorCode: val})
            }}
          />
          <input 
            type="password" placeholder="New Admin Password" 
            className="w-full p-3 border border-orange-200 rounded-xl"
            value={form.newPassword}
            onChange={(e) => setForm({...form, newPassword: e.target.value})}
          />
        </div>
      </Card>

      <Button onClick={handleSave} disabled={loading} className="w-full py-4">
        {loading ? "Saving..." : "Update Portal Settings"}
      </Button>
    </div>
  );
}