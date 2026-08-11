import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { pipe, switchMap, tap } from 'rxjs';

export interface Breakpoints {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export const breakpoints: Breakpoints = {
  xs: '(width < 40rem)',
  sm: '(width >= 40rem) and (width < 48rem)',
  md: '(width >= 48rem) and (width < 64rem)',
  lg: '(width >= 64rem) and (width < 80rem)',
  xl: '(width >= 80rem) and (width < 96rem)',
  '2xl': '(width >= 96rem)',
};

export interface BreakpointStore {
  breakPointsState: BreakpointState | null;
}

export const initialBreakpointStore: BreakpointStore = {
  breakPointsState: null,
};

export const BreakpointStore = signalStore(
  withState(initialBreakpointStore),
  withProps(() => ({
    _breakPointObserver: inject(BreakpointObserver),
  })),
  withComputed(store => ({
    isMobile: computed(() => {
      return (
        store.breakPointsState()?.breakpoints[breakpoints.sm] ||
        store.breakPointsState()?.breakpoints[breakpoints.xs]
      );
    }),

    isTablet: computed(() => {
      return store.breakPointsState()?.breakpoints[breakpoints.md];
    }),
    isDesktop: computed(() => {
      return (
        store.breakPointsState()?.breakpoints[breakpoints.lg] ||
        store.breakPointsState()?.breakpoints[breakpoints.xl] ||
        store.breakPointsState()?.breakpoints[breakpoints['2xl']]
      );
    }),
  })),
  withMethods(store => ({
    observeBreakpoints: rxMethod<void>(
      pipe(
        switchMap(() =>
          store._breakPointObserver.observe([
            breakpoints.xs,
            breakpoints.sm,
            breakpoints.md,
            breakpoints.lg,
            breakpoints.xl,
            breakpoints['2xl'],
          ])
        ),
        tap(breakPointsState => {
          patchState(store, {
            breakPointsState
          });
        })
      )
    ),
  })),
  withHooks(store => ({
    onInit() {
      store.observeBreakpoints();
    },
  }))
);
