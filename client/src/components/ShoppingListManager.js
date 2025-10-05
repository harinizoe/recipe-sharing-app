import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ShoppingListManager = () => {
  const navigate = useNavigate();
  const [shoppingLists, setShoppingLists] = useState([]);
  const [activeList, setActiveList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchShoppingLists();
    }
  }, [userId]);

  const fetchShoppingLists = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/shopping-lists/${userId}`);
      setShoppingLists(response.data);
      if (response.data.length > 0 && !activeList) {
        setActiveList(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewList = async () => {
    if (!newListName.trim()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/shopping-lists', {
        userId,
        name: newListName,
        items: []
      });
      
      setShoppingLists([response.data, ...shoppingLists]);
      setActiveList(response.data);
      setNewListName('');
      setShowNewListModal(false);
    } catch (error) {
      console.error('Error creating shopping list:', error);
      alert('Failed to create shopping list');
    }
  };

  const updateList = async (updatedList) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/shopping-lists/${updatedList._id}`, updatedList);
      
      setShoppingLists(lists => 
        lists.map(list => list._id === updatedList._id ? response.data : list)
      );
      setActiveList(response.data);
    } catch (error) {
      console.error('Error updating shopping list:', error);
    }
  };

  const toggleItemCheck = (itemIndex) => {
    if (!activeList) return;

    const updatedItems = [...activeList.items];
    updatedItems[itemIndex].checked = !updatedItems[itemIndex].checked;
    
    const updatedList = { ...activeList, items: updatedItems };
    updateList(updatedList);
  };

  const addItem = (ingredient, quantity = '1', unit = 'item', category = 'other') => {
    if (!activeList || !ingredient.trim()) return;

    // Helper to combine quantities (numeric add when possible, else fallback to second value)
    const combineQuantities = (q1, q2) => {
      const n1 = parseFloat(q1);
      const n2 = parseFloat(q2);
      if (!isNaN(n1) && !isNaN(n2)) {
        return (n1 + n2).toString();
      }
      // If one or both are non-numeric, prefer the new provided value
      return (q2 ?? q1 ?? '').toString();
    };

    const normalized = ingredient.trim().toLowerCase();
    const idx = activeList.items.findIndex(it => (it.ingredient || '').trim().toLowerCase() === normalized);

    let updatedItems;
    if (idx !== -1) {
      // Merge with existing item
      const existing = activeList.items[idx];
      const merged = {
        ...existing,
        // Keep original casing for ingredient name if present, else use new
        ingredient: existing.ingredient || ingredient.trim(),
        quantity: combineQuantities(existing.quantity, quantity),
        // Keep existing unit/category unless user provided something different explicitly
        unit: unit || existing.unit || 'item',
        category: category || existing.category || 'other',
      };
      updatedItems = [...activeList.items];
      updatedItems[idx] = merged;
    } else {
      // Add as new item
      const newItem = {
        ingredient: ingredient.trim(),
        quantity,
        unit,
        category,
        checked: false
      };
      updatedItems = [...activeList.items, newItem];
    }

    const updatedList = { ...activeList, items: updatedItems };
    updateList(updatedList);
  };

  const removeItem = (itemIndex) => {
    if (!activeList) return;

    const updatedItems = activeList.items.filter((_, index) => index !== itemIndex);
    const updatedList = { ...activeList, items: updatedItems };
    
    updateList(updatedList);
  };

  const deleteList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this shopping list?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/shopping-lists/${listId}`);
      
      const updatedLists = shoppingLists.filter(list => list._id !== listId);
      setShoppingLists(updatedLists);
      
      if (activeList && activeList._id === listId) {
        setActiveList(updatedLists.length > 0 ? updatedLists[0] : null);
      }
    } catch (error) {
      console.error('Error deleting shopping list:', error);
      alert('Failed to delete shopping list');
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      produce: 'bi-apple',
      dairy: 'bi-egg',
      meat: 'bi-meat',
      pantry: 'bi-box',
      frozen: 'bi-snow',
      bakery: 'bi-bread-slice',
      other: 'bi-bag'
    };
    return icons[category] || 'bi-bag';
  };

  const getCategoryColor = (category) => {
    const colors = {
      produce: '#22c55e',
      dairy: '#3b82f6',
      meat: '#ef4444',
      pantry: '#f59e0b',
      frozen: '#06b6d4',
      bakery: '#d97706',
      other: '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  const groupItemsByCategory = (items) => {
    const grouped = {};
    items.forEach(item => {
      const category = item.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    return grouped;
  };

  // Export the active shopping list as a CSV file
  const exportActiveListAsCSV = () => {
    if (!activeList || !activeList.items || activeList.items.length === 0) return;

    const headers = [
      'Ingredient',
      'Quantity',
      'Unit',
      'Category',
      'Checked',
      'Recipe Name',
      'List Name',
      'Created At'
    ];

    const rows = activeList.items.map(item => [
      (item.ingredient || '').toString().replace(/\n/g, ' ').trim(),
      (item.quantity || '').toString().replace(/\n/g, ' ').trim(),
      (item.unit || '').toString().replace(/\n/g, ' ').trim(),
      (item.category || '').toString().replace(/\n/g, ' ').trim(),
      item.checked ? 'Yes' : 'No',
      (item.recipeName || '').toString().replace(/\n/g, ' ').trim(),
      (activeList.name || '').toString().replace(/\n/g, ' ').trim(),
      activeList.createdAt ? new Date(activeList.createdAt).toLocaleString() : ''
    ]);

    const csvLines = [headers, ...rows].map(cols =>
      cols
        .map(val => {
          // Escape quotes and wrap fields with commas/newlines/quotes
          const v = (val ?? '').toString();
          if (/[",\n]/.test(v)) {
            return '"' + v.replace(/"/g, '""') + '"';
          }
          return v;
        })
        .join(',')
    );

    const csvContent = '\ufeff' + csvLines.join('\n'); // BOM for Excel compatibility
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const fileNameSafe = (activeList.name || 'shopping_list').replace(/[^a-z0-9_\-]+/gi, '_');
    const dt = new Date();
    const stamp = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileNameSafe}_${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!userId) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="glass-card p-5 mx-auto" style={{ maxWidth: '400px' }}>
            <i className="bi bi-cart-x display-4 text-muted mb-3"></i>
            <h3>Login Required</h3>
            <p className="text-muted">Please log in to access shopping lists.</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="loading-spinner mb-3"></div>
          <p className="text-muted">Loading shopping lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="fw-bold gradient-text mb-2">
                    <i className="bi bi-cart-check me-3"></i>
                    Shopping Lists
                  </h1>
                  <p className="text-muted mb-0">Organize your grocery shopping efficiently</p>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/meal-planning')}
                  >
                    <i className="bi bi-calendar-week me-2"></i>
                    Meal Planning
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={exportActiveListAsCSV}
                    disabled={!activeList || !activeList.items || activeList.items.length === 0}
                    title={!activeList || !activeList.items || activeList.items.length === 0 ? 'No items to export' : 'Download CSV'}
                  >
                    <i className="bi bi-download me-2"></i>
                    Download CSV
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowNewListModal(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    New List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Shopping Lists Sidebar */}
          <div className="col-lg-4 mb-4">
            <div className="glass-card p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-list-ul me-2"></i>
                Your Lists ({shoppingLists.length})
              </h5>
              
              {shoppingLists.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-cart-plus display-4 text-muted mb-3"></i>
                  <p className="text-muted">No shopping lists yet</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowNewListModal(true)}
                  >
                    Create Your First List
                  </button>
                </div>
              ) : (
                <div className="list-group">
                  {shoppingLists.map(list => {
                    const completedItems = list.items.filter(item => item.checked).length;
                    const totalItems = list.items.length;
                    const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

                    return (
                      <div
                        key={list._id}
                        className={`list-group-item cursor-pointer ${activeList?._id === list._id ? 'active' : ''}`}
                        onClick={() => setActiveList(list)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{list.name}</h6>
                            <small className="text-muted">
                              {completedItems}/{totalItems} items completed
                            </small>
                            <div className="progress mt-2" style={{ height: '4px' }}>
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteList(list._id);
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Active Shopping List */}
          <div className="col-lg-8">
            {activeList ? (
              <div className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">{activeList.name}</h4>
                  <div className="d-flex align-items-center gap-3">
                    <span className="badge bg-primary">
                      {activeList.items.filter(item => !item.checked).length} remaining
                    </span>
                    <span className="badge bg-success">
                      {activeList.items.filter(item => item.checked).length} completed
                    </span>
                  </div>
                </div>

                {/* Add Item Form */}
                <div className="mb-4">
                  <div className="row g-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add item to list..."
                        id="newItem"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target;
                            addItem(input.value);
                            input.value = '';
                          }
                        }}
                      />
                    </div>
                    <div className="col-md-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Qty"
                        id="newQuantity"
                        defaultValue="1"
                      />
                    </div>
                    <div className="col-md-2">
                      <select className="form-select" id="newCategory">
                        <option value="other">Other</option>
                        <option value="produce">Produce</option>
                        <option value="dairy">Dairy</option>
                        <option value="meat">Meat</option>
                        <option value="pantry">Pantry</option>
                        <option value="frozen">Frozen</option>
                        <option value="bakery">Bakery</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => {
                          const item = document.getElementById('newItem').value;
                          const quantity = document.getElementById('newQuantity').value;
                          const category = document.getElementById('newCategory').value;
                          
                          if (item.trim()) {
                            addItem(item, quantity, 'item', category);
                            document.getElementById('newItem').value = '';
                            document.getElementById('newQuantity').value = '1';
                          }
                        }}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Shopping Items by Category */}
                {activeList.items.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-cart display-4 text-muted mb-3"></i>
                    <h5 className="text-muted">Your shopping list is empty</h5>
                    <p className="text-muted">Add items above or generate from your meal plans</p>
                  </div>
                ) : (
                  <div className="shopping-items">
                    {Object.entries(groupItemsByCategory(activeList.items)).map(([category, items]) => (
                      <div key={category} className="category-section mb-4">
                        <h6 className="fw-bold mb-3 d-flex align-items-center">
                          <i 
                            className={`bi ${getCategoryIcon(category)} me-2`}
                            style={{ color: getCategoryColor(category) }}
                          ></i>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                          <span className="badge bg-light text-dark ms-2">{items.length}</span>
                        </h6>
                        
                        <div className="row g-2">
                          {items.map((item, itemIndex) => {
                            const globalIndex = activeList.items.findIndex(i => i === item);
                            return (
                              <div key={globalIndex} className="col-md-6">
                                <div className={`shopping-item p-3 rounded border ${item.checked ? 'bg-light text-muted' : 'bg-white'}`}>
                                  <div className="d-flex align-items-center">
                                    <input
                                      type="checkbox"
                                      className="form-check-input me-3"
                                      checked={item.checked}
                                      onChange={() => toggleItemCheck(globalIndex)}
                                    />
                                    <div className="flex-grow-1">
                                      <div className={`fw-semibold ${item.checked ? 'text-decoration-line-through' : ''}`}>
                                        {item.ingredient}
                                      </div>
                                      <small className="text-muted">
                                        {item.quantity} {item.unit}
                                        {item.recipeName && (
                                          <span className="ms-2">
                                            <i className="bi bi-journal-text me-1"></i>
                                            {item.recipeName}
                                          </span>
                                        )}
                                      </small>
                                    </div>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => removeItem(globalIndex)}
                                    >
                                      <i className="bi bi-x"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card p-5 text-center">
                <i className="bi bi-cart display-4 text-muted mb-3"></i>
                <h4 className="text-muted">Select a shopping list</h4>
                <p className="text-muted">Choose a list from the sidebar or create a new one</p>
              </div>
            )}
          </div>
        </div>

        {/* New List Modal */}
        {showNewListModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create New Shopping List</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowNewListModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">List Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="e.g., Weekly Groceries, Party Shopping..."
                      onKeyPress={(e) => e.key === 'Enter' && createNewList()}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowNewListModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={createNewList}
                    disabled={!newListName.trim()}
                  >
                    Create List
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListManager;
