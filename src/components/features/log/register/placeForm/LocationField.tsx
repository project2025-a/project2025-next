'use client';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useFormContext, useFormState } from 'react-hook-form';
import DaumPostcode from '../../common/DaumPostcode';

interface LocationFieldProps {
  fieldName: string;
}

const LocationField = ({ fieldName }: LocationFieldProps) => {
  const { control } = useFormContext();
  const { errors } = useFormState({ control, name: `${fieldName}.location` });
  const error = errors?.location;
  const t = useTranslations('Register.LogPage');

  return (
    <FormField
      control={control}
      name={`${fieldName}.location`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {t('locationLabel')}
            <span className="text-error-500"> *</span>
          </FormLabel>
          <FormControl>
            <div className="flex gap-2">
              <Input
                {...field}
                placeholder={t('locationPlaceholder')}
                className={cn(
                  'block w-full px-4 py-5 rounded-[8px] bg-light-50 text-black',
                  'placeholder:text-light-300 !text-[14px] focus:outline-none',
                  error && 'placeholder:text-error-500'
                )}
              />
              <DaumPostcode onComplete={field.onChange} />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default LocationField;
