/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ClothingItem, Reservation, User } from '../types';
import { supabaseClient } from '../lib/supabase';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  inventory: ClothingItem[];
  reservations: Reservation[];
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<User | null>;
  addInventoryItem: (item: Omit<ClothingItem, 'id' | 'status'>) => Promise<void>;
  reserveItem: (itemId: string, studentEmail: string, date: string, timeSlot: string) => Promise<void>;
  updateReservationStatus: (reservationId: string, status: 'APPROVED' | 'REJECTED') => Promise<void>;
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

      if (error) {
        console.error('Error fetching inventory:', error.message);
        return;
      }

      if (data) {
        const mapped: ClothingItem[] = data.map((row: any) => ({
          id: row.id,
          category: row.category,
          size: row.size,
          condition: row.condition,
          imageUrl: row.image_url,
          status: row.status
        }));
        setInventory(mapped);
      }
    } catch (err) {
      console.error('Inventory fetch failed:', err);
    }
  }, []);

  // ── Fetch reservations from Supabase ──
  const refreshReservations = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reservations:', error.message);
        return;
      }

      if (data) {
        const mapped: Reservation[] = data.map((row: any) => ({
          id: row.id,
          itemId: row.item_id,
          studentEmail: row.student_email,
          pickupDate: row.pickup_date,
          pickupTimeSlot: row.pickup_time,
          status: row.status
        }));
        setReservations(mapped);
      }
    } catch (err) {
      console.error('Reservations fetch failed:', err);
    }
  }, []);

  // ── Load data on mount ──
  useEffect(() => {
    refreshInventory();
    refreshReservations();
  }, [refreshInventory, refreshReservations]);

  // ── Login: validate credentials against users table ──
  const loginUser = async (email: string, password: string): Promise<User | null> => {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single();

      if (error || !data) {
        return null;
      }

      const roleMap: Record<string, string> = {
        'student': 'STUDENT',
        'admin': 'ADMIN',
        'coordinator': 'COORDINATOR'
      };

      const loggedInUser: User = {
        email: data.email,
        role: (roleMap[data.role] || 'STUDENT') as any,
        name: data.name
      };

      setUser(loggedInUser);
      // Refresh data after login
      await refreshInventory();
      await refreshReservations();
      return loggedInUser;
    } catch (err) {
      console.error('Login failed:', err);
      return null;
    }
  };

  // ── Add inventory item (Donor flow) ──
  const addInventoryItem = async (item: Omit<ClothingItem, 'id' | 'status'>) => {
    try {
      setLoading(true);
      const { error } = await supabaseClient
        .from('inventory')
        .insert({
          category: item.category,
          size: item.size,
          condition: item.condition,
          image_url: item.imageUrl,
          status: 'AVAILABLE'
        });

      if (error) {
        console.error('Error adding inventory item:', error.message);
        return;
      }

      // Refresh inventory after insert
      await refreshInventory();
    } catch (err) {
      console.error('Add inventory failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Reserve an item (Student flow) ──
  const reserveItem = async (itemId: string, studentEmail: string, date: string, timeSlot: string) => {
    try {
      setLoading(true);

      // Insert reservation
      const { error: resError } = await supabaseClient
        .from('reservations')
        .insert({
          item_id: itemId,
          student_email: studentEmail,
          pickup_date: date,
          pickup_time: timeSlot,
          status: 'PENDING'
        });

      if (resError) {
        console.error('Error creating reservation:', resError.message);
        return;
      }

      // Update inventory item status to RESERVED
      const { error: invError } = await supabaseClient
        .from('inventory')
        .update({ status: 'RESERVED' })
        .eq('id', itemId);

      if (invError) {
        console.error('Error updating inventory status:', invError.message);
      }

      // Refresh both datasets
      await refreshInventory();
      await refreshReservations();
    } catch (err) {
      console.error('Reserve item failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Update reservation status (Coordinator flow) ──
  const updateReservationStatus = async (reservationId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setLoading(true);

      // Update reservation status
      const { error: resError } = await supabaseClient
        .from('reservations')
        .update({ status })
        .eq('id', reservationId);

      if (resError) {
        console.error('Error updating reservation:', resError.message);
        return;
      }

      // Find the reservation to get the item_id
      const reservation = reservations.find(r => r.id === reservationId);
      if (reservation) {
        const newItemStatus = status === 'APPROVED' ? 'APPROVED' : 'AVAILABLE';
        const { error: invError } = await supabaseClient
          .from('inventory')
          .update({ status: newItemStatus })
          .eq('id', reservation.itemId);

        if (invError) {
          console.error('Error updating inventory status:', invError.message);
        }
      }

      // Refresh both datasets
      await refreshInventory();
      await refreshReservations();
    } catch (err) {
      console.error('Update reservation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser, 
      inventory, 
      reservations, 
      loading,
      loginUser,
      addInventoryItem, 
      reserveItem, 
      updateReservationStatus,
      refreshInventory,
      refreshReservations
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
