import { onActivated } from 'vue';
import { useTitle } from '@vueuse/core';

export function useTitles(propTitle: string): any {
  let title = useTitle(propTitle);
  onActivated(() => {
    title = useTitle(propTitle);
  });

  return title;
}
