import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Simple debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const SearchModule = ({ onSearchResults, onFiltersChange }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    cuisine: 'all',
    difficulty: 'all',
    category: 'all',
    vegetarian: 'all',
    maxPrepTime: '',
    maxCookTime: '',
    ingredients: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Debounced search suggestions
  const debouncedGetSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length >= 2) {
        try {
          const response = await axios.get(`http://localhost:5000/api/recipes/search/suggestions?query=${query}`);
          setSuggestions(response.data.suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedGetSuggestions(value);
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFiltersChange && onFiltersChange(newFilters);
  };

  // Perform search
  const performSearch = async (searchTerm = searchQuery, searchFilters = filters) => {
    setLoading(true);
    setShowSuggestions(false);
    
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        ...searchFilters
      });

      const response = await axios.get(`http://localhost:5000/api/recipes?${params}`);
      onSearchResults && onSearchResults(response.data);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'recipe') {
      navigate(`/recipes/${suggestion.id}`);
    } else {
      setSearchQuery(suggestion.value);
      handleFilterChange(suggestion.type, suggestion.value);
      performSearch(suggestion.value, { ...filters, [suggestion.type]: suggestion.value });
    }
    setShowSuggestions(false);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  // Clear all filters
  const clearFilters = () => {
    const defaultFilters = {
      cuisine: 'all',
      difficulty: 'all',
      category: 'all',
      vegetarian: 'all',
      maxPrepTime: '',
      maxCookTime: '',
      ingredients: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    onFiltersChange && onFiltersChange(defaultFilters);
    performSearch('', defaultFilters);
  };

  return (
    <div className="search-module mb-4">
      <div className="glass-card p-4">
        {/* Main Search Bar */}
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="position-relative">
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search recipes, ingredients, cuisines..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                style={{ fontSize: '1.1rem' }}
              />
              <button 
                type="submit" 
                className="btn btn-primary px-4"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : (
                  <i className="bi bi-search me-2"></i>
                )}
                Search
              </button>
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="position-absolute w-100 mt-1" style={{ zIndex: 1000 }}>
                <div className="glass-card border shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 border-bottom cursor-pointer hover-bg-light"
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center">
                        <i className={`bi ${
                          suggestion.type === 'recipe' ? 'bi-journal-text' :
                          suggestion.type === 'cuisine' ? 'bi-geo-alt' :
                          'bi-tag'
                        } me-2 text-muted`}></i>
                        <span>{suggestion.value}</span>
                        <small className="ms-auto text-muted text-capitalize">
                          {suggestion.type}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Quick Filter Buttons */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            className={`btn btn-sm ${showAdvancedFilters ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <i className="bi bi-funnel me-1"></i>
            Advanced Filters
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={clearFilters}
          >
            <i className="bi bi-x-circle me-1"></i>
            Clear All
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="advanced-filters border-top pt-3">
            <div className="row g-3">
              {/* Cuisine Filter */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-geo-alt me-1"></i>Cuisine
                </label>
                <select
                  className="form-select"
                  value={filters.cuisine}
                  onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                >
                  <option value="all">All Cuisines</option>
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Thai">Thai</option>
                  <option value="French">French</option>
                  <option value="American">American</option>
                  <option value="Mediterranean">Mediterranean</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-speedometer me-1"></i>Difficulty
                </label>
                <select
                  className="form-select"
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                >
                  <option value="all">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-tag me-1"></i>Category
                </label>
                <select
                  className="form-select"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Snack">Snack</option>
                  <option value="Appetizer">Appetizer</option>
                  <option value="Beverage">Beverage</option>
                </select>
              </div>

              {/* Vegetarian Filter */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-leaf me-1"></i>Diet
                </label>
                <select
                  className="form-select"
                  value={filters.vegetarian}
                  onChange={(e) => handleFilterChange('vegetarian', e.target.value)}
                >
                  <option value="all">All Diets</option>
                  <option value="Yes">Vegetarian</option>
                  <option value="No">Non-Vegetarian</option>
                </select>
              </div>

              {/* Time Filters */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-clock me-1"></i>Max Prep Time
                </label>
                <select
                  className="form-select"
                  value={filters.maxPrepTime}
                  onChange={(e) => handleFilterChange('maxPrepTime', e.target.value)}
                >
                  <option value="">Any Time</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-fire me-1"></i>Max Cook Time
                </label>
                <select
                  className="form-select"
                  value={filters.maxCookTime}
                  onChange={(e) => handleFilterChange('maxCookTime', e.target.value)}
                >
                  <option value="">Any Time</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              {/* Ingredients Filter */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-list-ul me-1"></i>Ingredients
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. chicken, tomato"
                  value={filters.ingredients}
                  onChange={(e) => handleFilterChange('ingredients', e.target.value)}
                />
                <small className="text-muted">Separate with commas</small>
              </div>

              {/* Sort Options */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-sort-down me-1"></i>Sort By
                </label>
                <div className="d-flex gap-2">
                  <select
                    className="form-select"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="createdAt">Date Added</option>
                    <option value="title">Name</option>
                    <option value="cuisine">Cuisine</option>
                    <option value="difficulty">Difficulty</option>
                  </select>
                  <select
                    className="form-select"
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={() => performSearch()}
              >
                <i className="bi bi-check2 me-2"></i>
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModule;
