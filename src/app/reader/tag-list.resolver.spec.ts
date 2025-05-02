import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { tagListResolver } from './tag-list.resolver';

describe('tagListResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => tagListResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
