'use client';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CATEGORIES } from '@/constants/categoryData';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

interface CategoryFieldProps {
  fieldName: string;
}

const CategoryField = ({ fieldName }: CategoryFieldProps) => {
  const { control, watch } = useFormContext();
  const categoryValue = watch(`${fieldName}.category`);
  const t = useTranslations('Category');

  return (
    <FormField
      control={control}
      name={`${fieldName}.category`}
      render={({ field }) => (
        <FormItem className="overflow-x-auto cursor-grab active:cursor-grabbing scrollbar-hide">
          <FormControl>
            <ToggleGroup
              type="single"
              value={field.value ?? ''}
              onValueChange={field.onChange}
              className={cn('flex gap-[4px] web:flex-wrap')}
            >
              {CATEGORIES.map((category) => (
                <ToggleGroupItem
                  key={category}
                  value={category}
                  className={cn(
                    'text-[12px] !text-light-300 rounded-full min-w-[50px] h-[26px] w-fit px-3 border',
                    !categoryValue && '!text-error-500 border-error-500'
                  )}
                >
                  {t(category)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default CategoryField;
