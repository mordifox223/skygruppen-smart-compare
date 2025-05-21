
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Share } from 'lucide-react';

interface QRCodeGeneratorProps {
  url?: string; // Optional, if not provided it will use current URL
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url }) => {
  const { language } = useLanguage();
  const currentUrl = url || window.location.href;
  
  const shareViaEmail = () => {
    const subject = language === 'nb' 
      ? 'Sjekk ut denne sammenligningen på Skygruppen Compare' 
      : 'Check out this comparison on Skygruppen Compare';
    const body = language === 'nb'
      ? `Jeg fant denne sammenligningen som jeg tror du vil like: ${currentUrl}`
      : `I found this comparison that I think you'll find interesting: ${currentUrl}`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const shareContent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === 'nb' ? 'Skygruppen Compare' : 'Skygruppen Compare',
          text: language === 'nb' 
            ? 'Sjekk ut denne sammenligningen på Skygruppen Compare!'
            : 'Check out this comparison on Skygruppen Compare!',
          url: currentUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(currentUrl);
      alert(language === 'nb' ? 'Lenke kopiert til utklippstavlen!' : 'Link copied to clipboard!');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {language === 'nb' ? 'Del denne sammenligningen' : 'Share this comparison'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <QRCodeSVG value={currentUrl} size={150} />
        
        <div className="mt-4 flex gap-2">
          <Button onClick={shareViaEmail} variant="outline" className="flex items-center gap-2">
            <Mail size={16} />
            <span className="hidden md:inline">Email</span>
          </Button>
          <Button onClick={shareContent} className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2">
            <Share size={16} />
            <span>{language === 'nb' ? 'Del' : 'Share'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
