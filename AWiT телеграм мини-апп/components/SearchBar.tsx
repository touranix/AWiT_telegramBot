import { useState } from 'react';
import { Search } from './ui/simple-icons';
import { Input } from './ui/simple-input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search 
          size={20} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"
        />
        <Input
          type="text"
          placeholder="Поиск по вопросам..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-12 pr-12 h-12 transition-colors"
          style={{
            backgroundColor: '#000000',
            borderColor: '#333333',
            color: '#ffffff'
          }}
        />
        <style jsx>{`
          input::placeholder {
            color: #ffffff !important;
            opacity: 0.7;
          }
          input:focus {
            border-color: #8b5cf6 !important;
            outline: none;
            box-shadow: 0 0 0 1px #8b5cf6;
          }
        `}</style>
        {isSearching && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div 
              className="w-5 h-5 border-2 border-purple-500 border-dashed rounded-full animate-spin"
              style={{
                animation: 'spin 1s linear infinite'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}