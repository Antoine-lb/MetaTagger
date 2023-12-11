import { action, autorun, computed, IComputedValue } from 'mobx';
import { useEffect } from 'react';
import { useLazy } from './useLazy';

/**
 * Creates an action function from a function in the current component.
 *
 * @param fun function that must only capture MobX objects or stable references.
 * @returns action function with stable identity across renders
 */
export function useAction<F extends (...args: any) => any>(fun: F): F {
  return useLazy(() => action(fun));
}

/**
 * Automatically re-runs effect when MobX observable changes.
 *
 * @param fun function that must only capture MobX objects or stable references.
 */
export function useAutorun(fun: () => void): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => autorun(fun), []);
}

/**
 * Creates computed value in the current component.
 *
 * @param fun function that must only capture MobX objects or stable references.
 * @returns computed value with stable reference across renders
 */
export function useComputed<T>(fun: () => T): IComputedValue<T> {
  return useLazy(() => computed(fun));
}
