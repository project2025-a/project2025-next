'use client';
import { TAG_SETS } from '@/constants/tagData';
import { TagKeys, useLogTagStore } from '@/stores/logTagStore';
import TagGroup from './TagGroup';

interface MultiTagGroupProps {
  title?: string;
  type: Extract<TagKeys, 'mood' | 'activity'>;
  value?: string[]; // 폼에서 직접 제어할 때
  onChange?: (value: string[]) => void; // 폼에서 직접 제어할 때
}

const MultiTagGroup = ({ title, type, value, onChange }: MultiTagGroupProps) => {
  const storeSelectedTags = useLogTagStore((state) => state[type]);
  const toggleMultiTag = useLogTagStore((state) => state.toggleMultiTag);

  // value가 있으면 폼 제어, 없으면 store 사용
  const selectedTags = value ?? storeSelectedTags;

  const handleTagClick = (tag: string) => {
    if (onChange) {
      if (selectedTags?.includes(tag)) {
        onChange(selectedTags.filter((t) => t !== tag));
      } else {
        onChange([...(selectedTags ?? []), tag]);
      }
    } else {
      toggleMultiTag(type, tag);
    }
  };

  const isTagSelected = (tag: string) => Array.isArray(selectedTags) && selectedTags.includes(tag);

  // 태그 타입에 따른 네임스페이스 설정
  const namespace = type === 'mood' || type === 'activity' ? 'MoodTags' : '';

  return (
    <TagGroup
      title={title}
      tags={TAG_SETS[type]}
      isSelected={isTagSelected}
      onTagClick={handleTagClick}
      namespace={namespace}
    />
  );
};

export default MultiTagGroup;
