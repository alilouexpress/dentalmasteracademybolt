import { api, uploadFile } from '@/lib/api';
import type { PurchaseRequest, SiteContent } from './types';

export async function fetchSiteContent(): Promise<SiteContent | null> {
  const { ok, data, error } = await api<SiteContent>(`/api/content?t=${Date.now()}`, { auth: false });
  if (!ok) {
    console.error('Error fetching site content:', error);
    return null;
  }
  return data;
}

export async function updateSiteContent(
  updates: Partial<SiteContent>
): Promise<{ error: string | null }> {
  const { ok, error } = await api<{ ok: boolean }>('/api/content', {
    method: 'PUT',
    body: { ...updates, updated_at: new Date().toISOString() },
  });
  return { error: ok ? null : error };
}

export async function uploadImage(file: File): Promise<{ url: string | null; error: string | null }> {
  const { ok, data, error } = await uploadFile(file);
  return { url: ok ? data.url : null, error: ok ? null : error };
}

export async function uploadVideo(file: File): Promise<{ url: string | null; error: string | null }> {
  const { ok, data, error } = await uploadFile(file);
  return { url: ok ? data.url : null, error: ok ? null : error };
}

export async function fetchPurchases(): Promise<PurchaseRequest[]> {
  const { ok, data, error } = await api<PurchaseRequest[]>('/api/purchases');
  if (!ok) {
    console.error('Error fetching purchases:', error);
    return [];
  }
  return data;
}

export async function updatePurchaseStatus(
  id: string,
  status: string
): Promise<{ error: string | null }> {
  const { ok, error } = await api<{ ok: boolean }>(`/api/purchases/${id}`, {
    method: 'PATCH',
    body: { status },
  });
  return { error: ok ? null : error };
}

export async function deletePurchase(id: string): Promise<{ error: string | null }> {
  const { ok, error } = await api<{ ok: boolean }>(`/api/purchases/${id}`, { method: 'DELETE' });
  return { error: ok ? null : error };
}

export async function submitPurchaseRequest(
  data: Omit<PurchaseRequest, 'id' | 'status' | 'created_at'>
): Promise<{ error: string | null }> {
  const { ok, error } = await api<PurchaseRequest>('/api/purchases', {
    method: 'POST',
    auth: false,
    body: data,
  });
  return { error: ok ? null : error };
}
