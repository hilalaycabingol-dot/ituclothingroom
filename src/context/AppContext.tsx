/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ClothingItem, Reservation, User, UserRole } from '../types';
import { supabaseClient } from '../lib/supabase';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  inventory: ClothingItem[];
  reservations: Reservation[];
  loading: boolean;
  signInUser: (email: string, password: string) => Promise<User | null>;
  signUpUser: (email: string, password: string, role: UserRole) => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<void>;
  addInventoryItem: (item: Omit<ClothingItem, 'id' | 'status'>) => Promise<void>;
  reserveItem: (itemId: string, studentEmail: string, date: string, timeSlot: string) => Promise<void>;
  updateReservationStatus: (reservationId: string, status: 'APPROVED' | 'REJECTED') => Promise<void>;
  confirmPickup: (reservationId: string) => Promise<void>;
  refreshInventory: () => Promise<void>;
  refreshReservations: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [inventory, setInventory] = useState<ClothingItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  // ── Fetch inventory from Supabase ──
  const refreshInventory = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) { console.error('Inventory error:', error.message); return; }
      if (data) {
        setInventory(data.map((row: any) => ({
          id: row.id, category: row.category, size: row.size,
          condition: row.condition, imageUrl: row.image_url, status: row.status
        })));
      }
    } catch (err) { console.error('Inventory fetch failed:', err); }
  }, []);

  // ── Fetch reservations from Supabase ──
  const refreshReservations = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) { console.error('Reservations error:', error.message); return; }
      if (data) {
        setReservations(data.map((row: any) => ({
          id: row.id, itemId: row.item_id, studentEmail: row.student_email,
          pickupDate: row.pickup_date, pickupTimeSlot: row.pickup_time, status: row.status
        })));
      }
    } catch (err) { console.error('Reservations fetch failed:', err); }
  }, []);

  useEffect(() => { refreshInventory(); refreshReservations(); }, [refreshInventory, refreshReservations]);

  // ── Sign Up: Supabase Auth + custom users table ──
  const signUpUser = async (email: string, password: string, role: UserRole): Promise<{ user: User | null; error: string | null }> => {
    try {
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({ email, password });
      if (authError) return { user: null, error: authError.message };

      const roleMap: Record<string, string> = { 'STUDENT': 'student', 'ADMIN': 'admin', 'COORDINATOR': 'coordinator' };
      const dbRole = roleMap[role] || 'student';

      const { error: insertError } = await supabaseClient.from('users').insert({
        email, name: email.split('@')[0], role: dbRole, password_hash: ''
      });
      if (insertError && !insertError.message.includes('duplicate')) {
        console.error('User insert error:', insertError.message);
      }

      return { user: { email, role, name: email.split('@')[0] }, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Kayıt hatası' };
    }
  };

  // ── Sign In: Supabase Auth + fetch role from users table ──
  const signInUser = async (email: string, password: string): Promise<User | null> => {
    try {
      const { error: authError } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (authError) {
        // Fallback: try custom users table auth
        const { data, error } = await supabaseClient
          .from('users').select('*').eq('email', email).eq('password_hash', password).single();
        if (error || !data) return null;
        const roleMap: Record<string, string> = { 'student': 'STUDENT', 'admin': 'ADMIN', 'coordinator': 'COORDINATOR' };
        const u: User = { email: data.email, role: (roleMap[data.role] || 'STUDENT') as UserRole, name: data.name };
        setUser(u);
        await refreshInventory(); await refreshReservations();
        return u;
      }

      // Fetch role from custom users table
      const { data: profile } = await supabaseClient.from('users').select('*').eq('email', email).single();
      if (profile) {
        const roleMap: Record<string, string> = { 'student': 'STUDENT', 'admin': 'ADMIN', 'coordinator': 'COORDINATOR' };
        const u: User = { email: profile.email, role: (roleMap[profile.role] || 'STUDENT') as UserRole, name: profile.name };
        setUser(u);
        await refreshInventory(); await refreshReservations();
        return u;
      }
      return null;
    } catch (err) { console.error('Login failed:', err); return null; }
  };

  // ── Sign Out ──
  const signOut = async () => {
    await supabaseClient.auth.signOut();
    setUser(null);
  };

  // ── Add inventory item (Donor flow) ──
  const addInventoryItem = async (item: Omit<ClothingItem, 'id' | 'status'>) => {
    try {
      setLoading(true);
      const { error } = await supabaseClient.from('inventory').insert({
        category: item.category, size: item.size, condition: item.condition,
        image_url: item.imageUrl, status: 'AVAILABLE'
      });
      if (error) { console.error('Add inventory error:', error.message); return; }
      await refreshInventory();
    } catch (err) { console.error('Add inventory failed:', err); }
    finally { setLoading(false); }
  };

  // ── Reserve an item (Student flow) ──
  const reserveItem = async (itemId: string, studentEmail: string, date: string, timeSlot: string) => {
    try {
      setLoading(true);
      const { error: resError } = await supabaseClient.from('reservations').insert({
        item_id: itemId, student_email: studentEmail, pickup_date: date,
        pickup_time: timeSlot, status: 'PENDING'
      });
      if (resError) { console.error('Reserve error:', resError.message); return; }
      await supabaseClient.from('inventory').update({ status: 'RESERVED' }).eq('id', itemId);
      await refreshInventory(); await refreshReservations();
    } catch (err) { console.error('Reserve failed:', err); }
    finally { setLoading(false); }
  };

  // ── Update reservation status (Coordinator: Approve/Reject) ──
  const updateReservationStatus = async (reservationId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setLoading(true);
      await supabaseClient.from('reservations').update({ status }).eq('id', reservationId);
      const reservation = reservations.find(r => r.id === reservationId);
      if (reservation && status === 'REJECTED') {
        await supabaseClient.from('inventory').update({ status: 'AVAILABLE' }).eq('id', reservation.itemId);
      }
      await refreshInventory(); await refreshReservations();
    } catch (err) { console.error('Update reservation failed:', err); }
    finally { setLoading(false); }
  };

  // ── Confirm physical pickup (Coordinator flow) ──
  const confirmPickup = async (reservationId: string) => {
    try {
      setLoading(true);
      await supabaseClient.from('reservations').update({ status: 'PICKED_UP' }).eq('id', reservationId);
      const reservation = reservations.find(r => r.id === reservationId);
      if (reservation) {
        await supabaseClient.from('inventory').update({ status: 'APPROVED' }).eq('id', reservation.itemId);
      }
      await refreshInventory(); await refreshReservations();
    } catch (err) { console.error('Confirm pickup failed:', err); }
    finally { setLoading(false); }
  };

  return (
    <AppContext.Provider value={{
      user, setUser, inventory, reservations, loading,
      signInUser, signUpUser, signOut,
      addInventoryItem, reserveItem, updateReservationStatus, confirmPickup,
      refreshInventory, refreshReservations
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
