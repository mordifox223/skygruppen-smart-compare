import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { ProviderOffer } from '@/hooks/useProviderOffers';

interface FormData {
  provider_name: string;
  category: string;
  plan_name: string;
  monthly_price: number;
  data_allowance: string;
  speed: string;
  contract_length: string;
  offer_url: string;
  direct_link: string;
  logo_url: string;
  features: string;
  is_active: boolean;
  data_source: 'scraped' | 'api' | 'manual' | 'cached';
}

interface ProviderOfferFormProps {
  onSubmit: (data: Omit<ProviderOffer, 'id' | 'last_updated'>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  initialData?: Partial<ProviderOffer>;
}

export const ProviderOfferForm: React.FC<ProviderOfferFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading,
  initialData
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      provider_name: initialData?.provider_name || '',
      category: initialData?.category || 'mobile',
      plan_name: initialData?.plan_name || '',
      monthly_price: initialData?.monthly_price || 0,
      data_allowance: initialData?.data_allowance || '',
      speed: initialData?.speed || '',
      contract_length: initialData?.contract_length || '',
      offer_url: initialData?.offer_url || '',
      direct_link: initialData?.direct_link || '',
      logo_url: initialData?.logo_url || '',
      features: JSON.stringify(initialData?.features || {}),
      is_active: initialData?.is_active ?? true,
      data_source: initialData?.data_source || 'manual'
    }
  });

  const onFormSubmit = async (data: FormData) => {
    try {
      const features = data.features ? JSON.parse(data.features) : {};
      await onSubmit({
        ...data,
        features,
        monthly_price: Number(data.monthly_price),
        last_scraped: null // This will be set by the database
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="provider_name">Provider Name</Label>
          <Input
            id="provider_name"
            {...register('provider_name', { required: 'Provider name is required' })}
            placeholder="e.g., Telia"
          />
          {errors.provider_name && (
            <p className="text-sm text-red-600">{errors.provider_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={(value) => setValue('category', value)} defaultValue={watch('category')}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="electricity">Electricity</SelectItem>
              <SelectItem value="insurance">Insurance</SelectItem>
              <SelectItem value="loan">Loan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="plan_name">Plan Name</Label>
          <Input
            id="plan_name"
            {...register('plan_name', { required: 'Plan name is required' })}
            placeholder="e.g., Telia Smart"
          />
          {errors.plan_name && (
            <p className="text-sm text-red-600">{errors.plan_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthly_price">Monthly Price (NOK)</Label>
          <Input
            id="monthly_price"
            type="number"
            step="0.01"
            {...register('monthly_price', { required: 'Price is required', min: 0 })}
            placeholder="299"
          />
          {errors.monthly_price && (
            <p className="text-sm text-red-600">{errors.monthly_price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_allowance">Data Allowance</Label>
          <Input
            id="data_allowance"
            {...register('data_allowance')}
            placeholder="e.g., 20GB"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="speed">Speed</Label>
          <Input
            id="speed"
            {...register('speed')}
            placeholder="e.g., 100 Mbps"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contract_length">Contract Length</Label>
          <Input
            id="contract_length"
            {...register('contract_length')}
            placeholder="e.g., 12 months"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_source">Data Source</Label>
          <Select onValueChange={(value) => setValue('data_source', value as 'scraped' | 'api' | 'manual' | 'cached')} defaultValue={watch('data_source')}>
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="scraped">Scraped</SelectItem>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="cached">Cached</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="offer_url">Offer URL</Label>
        <Input
          id="offer_url"
          {...register('offer_url', { required: 'Offer URL is required' })}
          placeholder="https://www.telia.se/privat/mobilt/mobilabonnemang"
        />
        {errors.offer_url && (
          <p className="text-sm text-red-600">{errors.offer_url.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="direct_link">Direct Link (Optional)</Label>
        <Input
          id="direct_link"
          {...register('direct_link')}
          placeholder="https://www.telia.se/direct-link"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo_url">Logo URL (Optional)</Label>
        <Input
          id="logo_url"
          {...register('logo_url')}
          placeholder="https://www.telia.se/logo.png"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (JSON)</Label>
        <Textarea
          id="features"
          {...register('features')}
          placeholder='{"calls": "Unlimited", "sms": "Unlimited", "roaming": "EU included"}'
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={watch('is_active')}
          onCheckedChange={(checked) => setValue('is_active', checked)}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Offer'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
