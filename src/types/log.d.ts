import { LogEditFormSchema, LogFormSchema } from '@/lib/zod/logSchema';
import { z } from 'zod';
import { AddedPlaceSchema } from './../lib/zod/logSchema';

export type LogFormValues = z.infer<typeof LogFormSchema>;
export type LogCreateValues = z.infer<typeof LogCreateSchema>;
export type AddedPlaceValues = z.infer<typeof AddedPlaceSchema>; // 로그 수정 시 새로 추가된 장소
export type LogEditFormValues = z.infer<typeof LogEditFormSchema>;
export type NewPlace = Omit<Tables<'place'>, 'created_at'>;
export type NewTag = {
  category: string;
  tag: string;
  log_id: string;
};
export type NewPlaceImage = Omit<
  Tables<'place_images'>,
  'place_image_id' | 'created_at' | 'updated_at'
>;
export type NewAddress = Omit<Tables<'address'>, 'created_at'>;
export type NewLog = Omit<Tables<'log'>, 'created_at'>;
