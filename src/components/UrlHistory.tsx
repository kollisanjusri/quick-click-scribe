
import { Card } from '@/components/ui/card';
import { CopyButton } from './CopyButton';
import { UrlEntry } from '@/types/url';
import { formatDistanceToNow } from 'date-fns';

interface UrlHistoryProps {
  history: UrlEntry[];
  onCopy: (entry: UrlEntry) => void;
}

export function UrlHistory({ history, onCopy }: UrlHistoryProps) {
  const truncateUrl = (url: string, maxLength: number = 40) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Your shortened URLs</h3>
      <div className="space-y-2">
        {history.map((entry) => (
          <Card key={entry.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex-1 min-w-0 mb-2 sm:mb-0">
              <div className="text-sm text-gray-500 truncate">
                {truncateUrl(entry.originalUrl)}
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={entry.shortUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-blue font-medium hover:underline truncate"
                  onClick={() => onCopy(entry)}
                >
                  {entry.shortUrl}
                </a>
                <CopyButton 
                  textToCopy={entry.shortUrl} 
                  onCopy={() => onCopy(entry)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span>{entry.clicks}</span>
                <span>clicks</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="hidden sm:block">{getTimeAgo(entry.createdAt)}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
