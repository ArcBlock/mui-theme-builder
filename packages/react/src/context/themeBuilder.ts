import { createContext, use } from 'react';
import createStore from 'src/state/createStore';
import { ThemeStoreModel } from 'src/types/theme';

type ThemeBuilderContextType = ReturnType<typeof createStore>;
type Selector<U> = (state: ThemeStoreModel) => U;

export const ThemeBuilderContext = createContext<ThemeBuilderContextType | null>(null);

export function useThemeBuilder(): ThemeStoreModel;
export function useThemeBuilder<U>(selector: Selector<U>): U;
export function useThemeBuilder<U>(selector?: Selector<U>) {
  const store = use(ThemeBuilderContext);
  if (!store) {
    throw new Error('useThemeBuilder must be used within <ThemeBuilder>');
  }
  return selector ? store(selector) : store();
}
