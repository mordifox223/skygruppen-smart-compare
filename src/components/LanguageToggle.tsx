
import React from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Button } from '@/components/ui/button';
import { Check, Globe } from 'lucide-react';
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
    nb: "https://flagcdn.com/w40/no.png",
    en: "https://flagcdn.com/w40/gb.png"
  };
  
  const languageNames = {
    nb: 'Norsk',
    en: 'English'
  };

  const handleFlagError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Flag image failed to load, using fallback');
    e.currentTarget.style.display = 'none';
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-gray-100">
          <Avatar className="h-6 w-6">
            <AvatarImage 
              src={flagMap[language]} 
              alt={`${languageNames[language]} flag`}
              onError={handleFlagError}
              className="object-cover"
            />
            <AvatarFallback className="bg-sky-100 text-sky-700">
              <Globe size={14} />
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline font-medium">
            {languageNames[language]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-50">
        <DropdownMenuItem 
          onClick={() => setLanguage('nb')} 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50"
        >
          <span className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage 
                src={flagMap.nb} 
                alt="Norwegian flag"
                onError={handleFlagError}
                className="object-cover"
              />
              <AvatarFallback className="bg-red-100 text-red-700 text-xs">NO</AvatarFallback>
            </Avatar>
            Norsk
          </span>
          {language === 'nb' && <Check size={16} className="text-sky-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('en')} 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50"
        >
          <span className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage 
                src={flagMap.en} 
                alt="UK flag"
                onError={handleFlagError}
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">EN</AvatarFallback>
            </Avatar>
            English
          </span>
          {language === 'en' && <Check size={16} className="text-sky-600" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
