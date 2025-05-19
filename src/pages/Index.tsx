
import { useEffect } from 'react';
import { UrlShortener } from '@/components/UrlShortener';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're on a path that might be a short URL code
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length === 1) {
      const shortCode = pathSegments[0];
      
      // Try to find this short code in our URL history
      const urlHistory = localStorage.getItem('urlHistory');
      if (urlHistory) {
        try {
          const history = JSON.parse(urlHistory);
          const matchingEntry = history.find((entry: any) => entry.shortCode === shortCode);
          
          if (matchingEntry) {
            // Update click count
            const updatedHistory = history.map((entry: any) => 
              entry.shortCode === shortCode 
                ? { ...entry, clicks: entry.clicks + 1 } 
                : entry
            );
            localStorage.setItem('urlHistory', JSON.stringify(updatedHistory));
            
            // Redirect to the original URL
            window.location.href = matchingEntry.originalUrl;
          }
        } catch (error) {
          console.error('Error parsing URL history:', error);
        }
      }
    }
  }, [location]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="container mx-auto py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-brand text-transparent bg-clip-text">
            QuickLink
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform long, unwieldy links into clean, memorable URLs. Share them easily across all platforms.
          </p>
        </header>
        
        <UrlShortener />
        
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} QuickLink • All URLs are accessible for 30 days</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
