
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  
  const flagMap = {
    nb: "https://cdn.countryflags.com/thumbs/norway/flag-round-250.png",
    en: "https://cdn.countryflags.com/thumbs/united-kingdom/flag-round-250.png"
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={flagMap[language]} alt={language === 'nb' ? 'Norwegian flag' : 'UK flag'} />
            <AvatarFallback>{language === 'nb' ? '🇳🇴' : '🇬🇧'}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline font-medium">
            {language === 'nb' ? 'Norsk' : 'English'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem onClick={() => setLanguage('nb')} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={flagMap.nb} alt="Norwegian flag" />
              <AvatarFallback>🇳🇴</AvatarFallback>
            </Avatar>
            Norsk
          </span>
          {language === 'nb' && <Check size={16} />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('en')} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={flagMap.en} alt="UK flag" />
              <AvatarFallback>🇬🇧</AvatarFallback>
            </Avatar>
            English
          </span>
          {language === 'en' && <Check size={16} />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
