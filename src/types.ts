/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'STUDENT' | 'ADMIN' | 'COORDINATOR' | 'DONOR_PUBLIC';

export interface User {
  email: string;
  role: UserRole;
  name: string;
}

export type ItemStatus = 'AVAILABLE' | 'RESERVED' | 'APPROVED' | 'REJECTED';

export interface ClothingItem {
  id: string;
  category: string;
  size: string;
  condition: string;
  imageUrl: string;
  status: ItemStatus;
}

export interface Reservation {
  id: string;
  itemId: string;
  studentEmail: string;
  pickupDate: string;
  pickupTimeSlot: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PICKED_UP';
  item?: ClothingItem; // Joined for UI convenience
}
