import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { postListResolver } from './post-list.resolver';

describe('postListResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => postListResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
