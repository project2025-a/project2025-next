'use client';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useFormContext, useFormState } from 'react-hook-form';

interface PlaceNameFieldProps {
  fieldName: string;
}

const PlaceNameField = ({ fieldName }: PlaceNameFieldProps) => {
  const t = useTranslations('Register.LogPage');
  const { control } = useFormContext();
  const { errors } = useFormState({ control, name: `${fieldName}.placeName` });
  const error = errors?.placeName;
  return (
    <FormField
      control={control}
      name={`${fieldName}.placeName`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {t('placeNameLabel')}
            <span className="text-error-500"> *</span>
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={t('placeNamePlaceholder')}
              className={cn(
                'block w-full px-4 py-5 rounded-[8px] bg-light-50 text-black',
                'placeholder:text-light-300 !text-[14px] focus:outline-none',
                error && 'placeholder:text-error-500'
              )}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default PlaceNameField;
