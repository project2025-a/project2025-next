import { XInputClearIcon } from '@/components/common/Icons';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useFormContext, useFormState } from 'react-hook-form';

const TitledInput = () => {
  const { control, setValue } = useFormContext();
  const { errors } = useFormState({ control, name: 'logTitle' });
  const error = errors?.logTitle;

  const t = useTranslations('Register.LogPage');

  return (
    // <div className="relative flex items-center mt-4">
    <div className="space-y-1 w-full mt-1">
      <label className="block text-[14px] font-semibold text-black">
        {t('titleLabel')}
        <span className="text-error-500"> *</span>
      </label>
      <div className="relative">
        <FormField
          control={control}
          name="logTitle"
          render={({ field }) => (
            <>
              <Input
                {...field}
                type="text"
                placeholder={`${t('titlePlaceholder')} *`}
                className={cn(
                  'block w-full px-4 py-6 rounded-[8px] bg-light-50 text-black',
                  'placeholder:text-light-300 !text-[14px] focus:outline-none',
                  error && 'placeholder:text-error-500'
                )}
                maxLength={30}
                required
              />
              <button
                type="button"
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 right-2 p-2 transition-opacity duration-300',
                  field.value ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                )}
                onClick={() => setValue('logTitle', '')}
              >
                <XInputClearIcon className="cursor-pointer hover:brightness-95" />
              </button>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default TitledInput;
