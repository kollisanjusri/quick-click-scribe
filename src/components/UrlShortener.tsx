
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { CopyButton } from './CopyButton';
import { UrlHistory } from './UrlHistory';
import { generateShortUrl } from '@/lib/url-utils';
import { UrlEntry } from '@/types/url';

export function UrlShortener() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [urlHistory, setUrlHistory] = useState<UrlEntry[]>([]);

  // Load URL history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('urlHistory');
    if (savedHistory) {
      try {
        setUrlHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing URL history from localStorage:', error);
      }
    }
  }, []);

  // Save URL history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('urlHistory', JSON.stringify(urlHistory));
  }, [urlHistory]);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }
    
    // Check if the URL is valid
    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate a short URL code
      const shortCode = generateShortUrl();
      const baseUrl = window.location.origin;
      const shortUrl = `${baseUrl}/${shortCode}`;
      
      // Create a new URL entry
      const newEntry: UrlEntry = {
        id: Date.now().toString(),
        originalUrl: url,
        shortUrl,
        shortCode,
        createdAt: new Date().toISOString(),
        clicks: 0
      };
      
      // Add to history
      setUrlHistory(prev => [newEntry, ...prev.slice(0, 19)]); // Keep only the 20 most recent
      
      toast.success('URL shortened successfully!');
      setUrl('');
    } catch (error) {
      toast.error('Failed to shorten URL');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementClicks = (id: string) => {
    setUrlHistory(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { ...entry, clicks: entry.clicks + 1 } 
          : entry
      )
    );
  };

  return (
    <Card className="p-6 w-full max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold bg-gradient-brand text-transparent bg-clip-text mb-2">
          URL Shortener
        </h2>
        <p className="text-gray-500">
          Transform your long URLs into short, shareable links
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL here"
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-gradient-brand hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? 'Shortening...' : 'Shorten'}
          </Button>
        </div>
      </form>
      
      {urlHistory.length > 0 && (
        <UrlHistory 
          history={urlHistory} 
          onCopy={(entry) => incrementClicks(entry.id)}
        />
      )}
    </Card>
  );
}
