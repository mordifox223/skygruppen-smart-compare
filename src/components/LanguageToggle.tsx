
import React from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          {language === 'nb' ? '🇳🇴' : '🇬🇧'}
          <span className="hidden md:inline">
            {language === 'nb' ? 'Norsk' : 'English'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('nb')} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🇳🇴 Norsk
          </span>
          {language === 'nb' && <Check size={16} />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('en')} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🇬🇧 English
          </span>
          {language === 'en' && <Check size={16} />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
