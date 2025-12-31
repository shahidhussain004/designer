"use client";

import { PageLayout } from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/context/AuthContext';
import { Edit, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  technologies: string[];
  displayOrder: number;
  isVisible: boolean;
  completionDate?: string;
  createdAt: string;
}

export default function PortfolioPage() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    technologies: '',
    isVisible: true,
    completionDate: '',
  });
  const [undoItem, setUndoItem] = useState<PortfolioItem | null>(null)

  // timer id for clearing undo state
  const undoTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    }
  }, [user]);

  const fetchPortfolio = async () => {
    try {
      const { data } = await apiClient.get(`/users/${user?.id}/portfolio`);
      setPortfolio(data || []);
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()),
      displayOrder: editingItem ? editingItem.displayOrder : portfolio.length + 1,
    };

    try {
      const url = editingItem 
        ? `/api/portfolio/${editingItem.id}?userId=${user?.id}`
        : `/api/portfolio?userId=${user?.id}`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      if (method === 'PUT') {
        await apiClient.put(`/portfolio/${editingItem?.id}?userId=${user?.id}`, payload);
      } else {
        await apiClient.post(`/portfolio?userId=${user?.id}`, payload);
      }

      await fetchPortfolio();
      resetForm();
    } catch (error) {
      console.error('Failed to save portfolio item:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      await apiClient.delete(`/portfolio/${id}?userId=${user?.id}`);
      await fetchPortfolio();
    } catch (error) {
      console.error('Failed to delete portfolio item:', error);
    }
  };

  const toggleVisibility = async (item: PortfolioItem) => {
    // optimistic update: hide/show locally immediately
    setPortfolio(prev => prev.map(p => p.id === item.id ? { ...p, isVisible: !p.isVisible } : p))

    // if hiding, show undo banner
    if (item.isVisible) {
      setUndoItem({ ...item, isVisible: false })
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current)
      // auto-clear undo after 6 seconds
      undoTimerRef.current = window.setTimeout(() => {
        setUndoItem(null)
        undoTimerRef.current = null
      }, 6000)
    }

    try {
      await apiClient.put(`/portfolio/${item.id}?userId=${user?.id}`, { ...item, isVisible: !item.isVisible });
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      // revert optimistic change on error
      setPortfolio(prev => prev.map(p => p.id === item.id ? item : p))
      setUndoItem(null)
      if (undoTimerRef.current) { window.clearTimeout(undoTimerRef.current); undoTimerRef.current = null }
    }
  };

  const restoreVisibility = async (item: PortfolioItem) => {
    // cancel pending timer
    if (undoTimerRef.current) { window.clearTimeout(undoTimerRef.current); undoTimerRef.current = null }
    setUndoItem(null)
    // optimistic restore locally
    setPortfolio(prev => prev.map(p => p.id === item.id ? { ...p, isVisible: true } : p))
    try {
      await apiClient.put(`/portfolio/${item.id}?userId=${user?.id}`, { ...item, isVisible: true });
    } catch (err) {
      console.error('Failed to restore visibility:', err)
    }
  }

  const editItem = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      projectUrl: item.projectUrl,
      technologies: item.technologies.join(', '),
      isVisible: item.isVisible,
      completionDate: item.completionDate || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      projectUrl: '',
      technologies: '',
      isVisible: true,
      completionDate: '',
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
          <p className="text-gray-600 mt-2">Showcase your best work to potential clients</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit Project' : 'Add New Project'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="E.g., E-commerce Website Redesign"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the project, your role, and key achievements..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/project-image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project URL
                </label>
                <input
                  type="url"
                  value={formData.projectUrl}
                  onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/project"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies (comma-separated) *
              </label>
              <input
                type="text"
                required
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="React, Node.js, PostgreSQL, AWS"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion Date
                </label>
                <input
                  type="date"
                  value={formData.completionDate}
                  onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isVisible" className="ml-2 text-sm text-gray-700">
                  Make this project visible to clients
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {editingItem ? 'Update Project' : 'Add Project'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Undo banner for hide action */}
      {undoItem && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center gap-4">
          <div>Project hidden</div>
          <button
            onClick={() => restoreVisibility(undoItem)}
            className="underline text-blue-200"
          >
            Undo
          </button>
        </div>
      )}

      {portfolio.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">You have not added any portfolio projects yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first project
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${!item.isVisible ? 'opacity-80 border-l-4 border-yellow-300' : ''}`}
            >
              <div className="md:flex">
                <div className="md:w-1/3 relative h-64">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                        {!item.isVisible && (
                          <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                            Not visible to public
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => toggleVisibility(item)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition flex items-center gap-2"
                        title={item.isVisible ? 'Hide from public' : 'Make visible to public'}
                      >
                        {item.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                        <span className="text-sm text-gray-600">{item.isVisible ? 'Visible' : 'Hidden'}</span>
                      </button>

                      <button
                        onClick={() => editItem(item)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition"
                        aria-label="Edit project"
                      >
                        <Edit size={20} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition"
                        aria-label="Delete project"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{item.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.technologies.map((tech) => (
                      <span
                        key={`${item.id}-${tech}`}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {item.projectUrl && (
                    <a
                      href={item.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </PageLayout>
  );
}
