'use client';
import { RegisterFooter } from '@/components/common/Footer';
import { PageIntro, SingleTagGroup } from '@/components/features/log/register/tags';
import { REGISTER_PATHS } from '@/constants/pathname';
import { useLogTagStore } from '@/stores/logTagStore';

const LocationSelectionPage = () => {
  const selectedCountry = useLogTagStore((state) => state.country);
  const selectedCity = useLogTagStore((state) => state.city);

  return (
    <>
      <div className="grow space-y-6">
        {/* Country  */}
        <div className="space-y-3">
          <PageIntro type="country" />
          <SingleTagGroup type="country" />
        </div>

        {/* City */}
        {selectedCountry && (
          <div className="space-y-3">
            <PageIntro type="city" />
            <SingleTagGroup type="city" />
          </div>
        )}

        {/* Sigungu */}
        {selectedCity && (
          <div className="space-y-3">
            <PageIntro type="sigungu" />
            <SingleTagGroup type="sigungu" />
          </div>
        )}
      </div>

      <RegisterFooter tagTargets={['country', 'city', 'sigungu']} nextPath={REGISTER_PATHS.LOG} />
    </>
  );
};

export default LocationSelectionPage;
