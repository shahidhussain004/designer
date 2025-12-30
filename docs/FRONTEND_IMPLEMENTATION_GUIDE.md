# Frontend Implementation Guide

## Overview
This guide provides implementation patterns for integrating the new database features (Portfolio, Contracts, Reviews) into the React/Next.js frontend.

---

## 1. Portfolio Management

### API Service: `portfolioService.ts`

```typescript
// services/portfolioService.ts
import { apiClient } from './apiClient';

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  technologies: string[];
  completionDate?: string;
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioItemRequest {
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  technologies: string[];
  completionDate?: string;
  isVisible: boolean;
}

export const portfolioService = {
  // Get user's portfolio (public or own)
  getUserPortfolio: async (userId: number): Promise<PortfolioItem[]> => {
    const response = await apiClient.get(`/users/${userId}/portfolio`);
    return response.data;
  },

  // Create new portfolio item
  create: async (data: CreatePortfolioItemRequest): Promise<PortfolioItem> => {
    const response = await apiClient.post('/portfolio', data);
    return response.data;
  },

  // Update portfolio item
  update: async (itemId: number, data: CreatePortfolioItemRequest): Promise<PortfolioItem> => {
    const response = await apiClient.put(`/portfolio/${itemId}`, data);
    return response.data;
  },

  // Delete portfolio item
  delete: async (itemId: number): Promise<void> => {
    await apiClient.delete(`/portfolio/${itemId}`);
  },

  // Reorder portfolio items
  reorder: async (orderedIds: number[]): Promise<void> => {
    await apiClient.patch('/portfolio/reorder', orderedIds);
  },
};
```

### Component: Portfolio Display

```typescript
// components/Portfolio/PortfolioGrid.tsx
import React from 'react';
import { PortfolioItem } from '@/services/portfolioService';
import PortfolioCard from './PortfolioCard';

interface Props {
  items: PortfolioItem[];
  editable?: boolean;
  onEdit?: (item: PortfolioItem) => void;
  onDelete?: (itemId: number) => void;
}

export default function PortfolioGrid({ items, editable, onEdit, onDelete }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No portfolio items yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <PortfolioCard
          key={item.id}
          item={item}
          editable={editable}
          onEdit={() => onEdit?.(item)}
          onDelete={() => onDelete?.(item.id)}
        />
      ))}
    </div>
  );
}
```

```typescript
// components/Portfolio/PortfolioCard.tsx
import React from 'react';
import Image from 'next/image';
import { PortfolioItem } from '@/services/portfolioService';
import { FiExternalLink, FiEdit, FiTrash2 } from 'react-icons/fi';

interface Props {
  item: PortfolioItem;
  editable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PortfolioCard({ item, editable, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {item.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        
        {item.technologies && item.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {item.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          {item.projectUrl && (
            <a
              href={item.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
            >
              View Project <FiExternalLink />
            </a>
          )}
          
          {editable && (
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2 text-gray-600 hover:text-blue-600"
                aria-label="Edit"
              >
                <FiEdit />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-600 hover:text-red-600"
                aria-label="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Component: Portfolio Form Modal

```typescript
// components/Portfolio/PortfolioFormModal.tsx
import React, { useState, useEffect } from 'react';
import { PortfolioItem, CreatePortfolioItemRequest } from '@/services/portfolioService';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePortfolioItemRequest) => Promise<void>;
  item?: PortfolioItem;
}

export default function PortfolioFormModal({ isOpen, onClose, onSubmit, item }: Props) {
  const [formData, setFormData] = useState<CreatePortfolioItemRequest>({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    technologies: [],
    completionDate: '',
    isVisible: true,
  });
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        projectUrl: item.projectUrl || '',
        technologies: item.technologies || [],
        completionDate: item.completionDate || '',
        isVisible: item.isVisible,
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Portfolio Item' : 'Add Portfolio Item'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          maxLength={255}
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          maxLength={2000}
        />

        <ImageUpload
          label="Project Image"
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
        />

        <Input
          label="Project URL"
          type="url"
          value={formData.projectUrl}
          onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
          placeholder="https://example.com"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Technologies
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              placeholder="e.g., React, TypeScript"
            />
            <Button type="button" onClick={addTechnology} variant="secondary">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <Input
          label="Completion Date"
          type="date"
          value={formData.completionDate}
          onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isVisible}
            onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
          />
          <span className="text-sm text-gray-700">Make this portfolio item public</span>
        </label>

        <div className="flex gap-3 justify-end">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {item ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

### Page: Portfolio Management

```typescript
// pages/portfolio/index.tsx
import React, { useState, useEffect } from 'react';
import { portfolioService, PortfolioItem, CreatePortfolioItemRequest } from '@/services/portfolioService';
import PortfolioGrid from '@/components/Portfolio/PortfolioGrid';
import PortfolioFormModal from '@/components/Portfolio/PortfolioFormModal';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';

export default function MyPortfolio() {
  const { user } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | undefined>();

  useEffect(() => {
    loadPortfolio();
  }, [user]);

  const loadPortfolio = async () => {
    if (!user) return;
    
    try {
      const data = await portfolioService.getUserPortfolio(user.id);
      setItems(data);
    } catch (error) {
      toast.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreatePortfolioItemRequest) => {
    await portfolioService.create(data);
    toast.success('Portfolio item created');
    loadPortfolio();
  };

  const handleUpdate = async (data: CreatePortfolioItemRequest) => {
    if (!editingItem) return;
    await portfolioService.update(editingItem.id, data);
    toast.success('Portfolio item updated');
    loadPortfolio();
  };

  const handleDelete = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;
    
    await portfolioService.delete(itemId);
    toast.success('Portfolio item deleted');
    loadPortfolio();
  };

  const openEditModal = (item: PortfolioItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(undefined);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Portfolio</h1>
        <Button onClick={() => setModalOpen(true)}>Add Portfolio Item</Button>
      </div>

      <PortfolioGrid
        items={items}
        editable
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <PortfolioFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={editingItem ? handleUpdate : handleCreate}
        item={editingItem}
      />
    </div>
  );
}
```

---

## 2. Contracts Management

### API Service: `contractService.ts`

```typescript
// services/contractService.ts
import { apiClient } from './apiClient';

export interface Contract {
  id: number;
  jobId: number;
  clientId: number;
  freelancerId: number;
  proposalId?: number;
  title: string;
  description: string;
  contractType: 'FIXED' | 'HOURLY';
  totalAmount: number;
  paymentSchedule: 'UPFRONT' | 'MILESTONE' | 'HOURLY';
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const contractService = {
  // Get contracts for current user
  getMyContracts: async (): Promise<Contract[]> => {
    const response = await apiClient.get('/contracts/me');
    return response.data;
  },

  // Get contract details
  getContract: async (contractId: number): Promise<Contract> => {
    const response = await apiClient.get(`/contracts/${contractId}`);
    return response.data;
  },

  // Create contract from proposal
  createFromProposal: async (proposalId: number): Promise<Contract> => {
    const response = await apiClient.post('/contracts', { proposalId });
    return response.data;
  },

  // Update contract status
  updateStatus: async (contractId: number, status: string): Promise<Contract> => {
    const response = await apiClient.patch(`/contracts/${contractId}/status`, { status });
    return response.data;
  },
};
```

### Component: Contract Card

```typescript
// components/Contracts/ContractCard.tsx
import React from 'react';
import { Contract } from '@/services/contractService';
import { formatCurrency, formatDate } from '@/utils/format';

interface Props {
  contract: Contract;
  onClick: () => void;
}

export default function ContractCard({ contract, onClick }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'DISPUTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{contract.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(contract.status)}`}>
          {contract.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{contract.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Type:</span>
          <span className="ml-2 font-medium">{contract.contractType}</span>
        </div>
        <div>
          <span className="text-gray-500">Amount:</span>
          <span className="ml-2 font-medium">{formatCurrency(contract.totalAmount)}</span>
        </div>
        <div>
          <span className="text-gray-500">Start:</span>
          <span className="ml-2">{formatDate(contract.startDate)}</span>
        </div>
        <div>
          <span className="text-gray-500">End:</span>
          <span className="ml-2">{formatDate(contract.endDate)}</span>
        </div>
      </div>
    </div>
  );
}
```

---

## 3. Reviews System

### API Service: `reviewService.ts`

```typescript
// services/reviewService.ts
import { apiClient } from './apiClient';

export interface Review {
  id: number;
  contractId: number;
  reviewerUserId: number;
  reviewedUserId: number;
  rating: number;
  comment: string;
  categories: Record<string, number>;
  isAnonymous: boolean;
  status: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  contractId: number;
  reviewedUserId: number;
  rating: number;
  comment: string;
  categories: Record<string, number>;
  isAnonymous: boolean;
}

export const reviewService = {
  // Create review
  create: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await apiClient.post('/reviews', data);
    return response.data;
  },

  // Get reviews for a user
  getUserReviews: async (userId: number): Promise<Review[]> => {
    const response = await apiClient.get(`/users/${userId}/reviews`);
    return response.data;
  },
};
```

### Component: Review Form

```typescript
// components/Reviews/ReviewForm.tsx
import React, { useState } from 'react';
import { CreateReviewRequest } from '@/services/reviewService';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import StarRating from '@/components/ui/StarRating';

interface Props {
  contractId: number;
  reviewedUserId: number;
  onSubmit: (data: CreateReviewRequest) => Promise<void>;
  onCancel: () => void;
}

export default function ReviewForm({ contractId, reviewedUserId, onSubmit, onCancel }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [categories, setCategories] = useState({
    communication: 5,
    quality: 5,
    timeliness: 5,
    professionalism: 5,
  });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit({
        contractId,
        reviewedUserId,
        rating,
        comment,
        categories,
        isAnonymous,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Rating
        </label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Category Ratings</h3>
        {Object.keys(categories).map((category) => (
          <div key={category}>
            <label className="block text-sm text-gray-700 mb-1 capitalize">
              {category}
            </label>
            <StarRating
              value={categories[category as keyof typeof categories]}
              onChange={(val) => setCategories({ ...categories, [category]: val })}
            />
          </div>
        ))}
      </div>

      <Textarea
        label="Review Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        placeholder="Share your experience working together..."
        required
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
        />
        <span className="text-sm text-gray-700">Post anonymously</span>
      </label>

      <div className="flex gap-3 justify-end">
        <Button type="button" onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Submit Review
        </Button>
      </div>
    </form>
  );
}
```

---

## 4. State Management (Redux/Zustand)

### Portfolio Store (Zustand Example)

```typescript
// stores/portfolioStore.ts
import create from 'zustand';
import { portfolioService, PortfolioItem } from '@/services/portfolioService';

interface PortfolioStore {
  items: PortfolioItem[];
  loading: boolean;
  error: string | null;
  fetchPortfolio: (userId: number) => Promise<void>;
  addItem: (data: any) => Promise<void>;
  updateItem: (itemId: number, data: any) => Promise<void>;
  deleteItem: (itemId: number) => Promise<void>;
  reorderItems: (orderedIds: number[]) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchPortfolio: async (userId) => {
    set({ loading: true, error: null });
    try {
      const items = await portfolioService.getUserPortfolio(userId);
      set({ items, loading: false });
    } catch (error) {
      set({ error: 'Failed to load portfolio', loading: false });
    }
  },

  addItem: async (data) => {
    const newItem = await portfolioService.create(data);
    set({ items: [...get().items, newItem] });
  },

  updateItem: async (itemId, data) => {
    const updatedItem = await portfolioService.update(itemId, data);
    set({
      items: get().items.map((item) => (item.id === itemId ? updatedItem : item)),
    });
  },

  deleteItem: async (itemId) => {
    await portfolioService.delete(itemId);
    set({ items: get().items.filter((item) => item.id !== itemId) });
  },

  reorderItems: async (orderedIds) => {
    await portfolioService.reorder(orderedIds);
    const reordered = orderedIds
      .map((id) => get().items.find((item) => item.id === id))
      .filter(Boolean) as PortfolioItem[];
    set({ items: reordered });
  },
}));
```

---

## 5. Mobile Responsiveness

All components should use Tailwind's responsive classes:

```typescript
// Mobile-first responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Portfolio cards */}
</div>

// Responsive padding and text
<div className="px-4 sm:px-6 lg:px-8">
  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
    Portfolio
  </h1>
</div>
```

---

## Next Steps

1. Implement API services with proper error handling
2. Create reusable UI components (Button, Input, Modal, etc.)
3. Build feature-specific components (Portfolio, Contracts, Reviews)
4. Add state management (Redux/Zustand/Context)
5. Implement image upload with AWS S3 or similar
6. Add loading states and error handling
7. Write component tests (Jest + React Testing Library)
8. Implement responsive design for mobile
9. Add accessibility features (ARIA labels, keyboard navigation)
10. Deploy and test in staging environment

For backend API reference, see `BACKEND_IMPLEMENTATION_GUIDE.md`.
