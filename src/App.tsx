import { useState, useMemo, useEffect } from 'react';
import type { TennisCourt, FilterOptions } from './types';
import { apiService } from './services/api';
import { Navbar } from './components/Navbar';
import { SearchAndFilters } from './components/SearchAndFilters';
import { CourtCard } from './components/CourtCard';
import { CourtDetail } from './components/CourtDetail';

type Page = 'court-list' | 'court-detail';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('court-list');
  const [selectedCourt, setSelectedCourt] = useState<TennisCourt | null>(null);
  const [courts, setCourts] = useState<TennisCourt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    rating: '',
    surface: ''
  });

  // Load courts from API
  useEffect(() => {
    const loadCourts = async () => {
      setLoading(true);
      setError(null);
      try {
        const courtsData = await apiService.getCourts();
        setCourts(courtsData);
      } catch (err) {
        setError('Failed to load courts. Please check if the backend server is running.');
        console.error('Error loading courts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourts();
  }, []);

  // Load persisted search/filters from localStorage (mobile-friendly continuity)
  useEffect(() => {
    const saved = localStorage.getItem('tc_filters');
    if (saved) {
      const { search, filters } = JSON.parse(saved);
      if (typeof search === 'string') setSearchTerm(search);
      if (filters) setFilters(filters);
    }
  }, []);

  // Persist search/filters
  useEffect(() => {
    localStorage.setItem('tc_filters', JSON.stringify({ search: searchTerm, filters }));
  }, [searchTerm, filters]);

  // Filter courts based on search and filters
  const filteredCourts = useMemo(() => {
    return courts.filter(court => {
      const matchesSearch = !searchTerm || 
        court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSurface = !filters.surface || court.surface === filters.surface;
      const matchesRating = !filters.rating || court.rating >= parseFloat(filters.rating);
      
      return matchesSearch && matchesSurface && matchesRating;
    });
  }, [courts, searchTerm, filters]);

  const handleCourtClick = (courtId: number) => {
    const court = courts.find(c => c.id === courtId);
    if (court) {
      setSelectedCourt(court);
      setCurrentPage('court-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToList = () => {
    setCurrentPage('court-list');
    setSelectedCourt(null);
    setSearchTerm('');
    setFilters({ rating: '', surface: '' });
  };

  const handleReviewSubmit = async (review: { name: string; rating: number; text: string }) => {
    if (!selectedCourt) return;

    try {
      setLoading(true);
      const result = await apiService.addReview(selectedCourt.id, review);
      
      // Update the selected court with the new data
      setSelectedCourt(result.court);
      
      // Update the courts list
      setCourts(prevCourts => 
        prevCourts.map(court => 
          court.id === selectedCourt.id ? result.court : court
        )
      );

      // Show success notification
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        showBackButton={currentPage === 'court-detail'} 
        onBack={handleBackToList}
      />
      
      <main className="container-wide py-4 md:py-8">
        {currentPage === 'court-list' && (
          <div className="court-list-page flex flex-col items-center">
            <SearchAndFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filters}
              onFilterChange={setFilters}
            />
            
            {loading && (
              <div className="loading-state text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading courts...</p>
              </div>
            )}
            
            {error && (
              <div className="error-state text-center py-12">
                <i className="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Courts</h3>
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            )}
            
            {!loading && !error && (
              <>
                <div className="results-count text-center mb-6 text-gray-600">
                  {filteredCourts.length} court{filteredCourts.length !== 1 ? 's' : ''} found
                </div>
                
                {filteredCourts.length === 0 ? (
                  <div className="empty-state text-center py-12">
                    <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No courts found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="court-cards grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 w-full">
                    {filteredCourts.map((court) => (
                      <CourtCard
                        key={court.id}
                        court={court}
                        onClick={handleCourtClick}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
        
        {currentPage === 'court-detail' && selectedCourt && (
          <CourtDetail
            court={selectedCourt}
            onReviewSubmit={handleReviewSubmit}
          />
        )}
      </main>
    </div>
  );
}

export default App;
