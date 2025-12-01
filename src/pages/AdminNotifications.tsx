import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

const AdminNotifications = () => {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [nots, setNots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/notifications`);
      if (!res.ok) throw new Error('Failed to load notifications');
      const j = await res.json();
      setNots(j.notifications || []);
    } catch (e) {
      toast.error('Failed to load notifications: ' + String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Notifications</h1>
          <div className="space-y-4">
            <div className="flex gap-2 items-center mb-4">
              <Button onClick={() => load()}>Refresh</Button>
              <span className="text-sm text-muted-foreground">{loading ? 'Loading...' : `${nots.length} notifications`}</span>
            </div>
            {nots.map(n => (
              <Card key={n.createdAt + n.itemId} className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{n.createdAt}</p>
                    <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(n, null, 2)}</pre>
                  </div>
                  <div className="ml-4 text-right">
                    <Button onClick={async () => {
                      try {
                        const res = await fetch(`${API_BASE}/admin/notifications/${n.id}/resend`, { method: 'POST' });
                        if (!res.ok) throw new Error('Failed to resend');
                        const j = await res.json();
                        toast.success('Resend triggered');
                      } catch (e) { toast.error('Failed to resend: ' + String(e)); }
                    }}>Resend</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminNotifications;
