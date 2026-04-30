import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  'Smileys': ['😊', '😄', '😃', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙'],
  'Gestures': ['👍', '👎', '👌', '🤝', '👏', '🙏', '💪', '👋', '🤚', '🖐️', '✋', '🖖', '👆', '🖕', '👇', '☝️', '👈', '👉', '🤞', '🤟'],
  'Objects': ['📝', '📊', '📈', '📉', '💼', '📋', '📌', '📍', '🔍', '💡', '⚡', '🔥', '💯', '✅', '❌', '⭐', '🎯', '🏆', '🎉', '🎊'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'],
};

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState('Smileys');
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          type="button"
          variant="ghost" 
          size="icon" 
          className="hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0"
        >
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" side="top">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-3">
          <div className="grid grid-cols-8 gap-1">
            {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Click an emoji to add it to your message
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}