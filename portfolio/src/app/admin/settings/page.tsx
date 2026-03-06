'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShieldCheck, UserCog } from 'lucide-react';

export default function SettingsPage() {
  const [form, setForm] = useState({ email: '', bio: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) alert("Settings updated successfully!");
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>
      
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4 text-teal-600">
          <UserCog size={20} />
          <h2 className="font-bold">Profile Settings</h2>
        </div>
        <div className="space-y-4">
          <input 
            type="email" placeholder="Contact Email" className="w-full p-3 border rounded-xl"
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
          <textarea 
            placeholder="Admin Bio" className="w-full p-3 border rounded-xl h-24"
            onChange={(e) => setForm({...form, bio: e.target.value})}
          />
        </div>
      </Card>

      <Card className="p-6 mb-8 border-orange-100 bg-orange-50/30">
        <div className="flex items-center gap-2 mb-4 text-orange-600">
          <ShieldCheck size={20} />
          <h2 className="font-bold">Security</h2>
        </div>
        <input 
          type="password" placeholder="New Admin Password" 
          className="w-full p-3 border border-orange-200 rounded-xl"
          onChange={(e) => setForm({...form, newPassword: e.target.value})}
        />
      </Card>

      <Button onClick={handleSave} disabled={loading} className="w-full py-4">
        {loading ? "Saving..." : "Update Portal Settings"}
      </Button>
    </div>
  );
}