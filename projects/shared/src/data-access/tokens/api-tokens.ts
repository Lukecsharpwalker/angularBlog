import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../../models';

/**
 * Interface for Tags API operations
 */
export interface TagsApiService {
  getTags(): Observable<Tag[] | null>;
}

/**
 * Injection token for Tags API service
 */
export const TAGS_API_SERVICE = new InjectionToken<TagsApiService>('TagsApiService');