import { onMounted, onUnmounted } from 'vue';
function useLeftColumn() {
  const emit = defineEmits(['update:hideAside']);
  function hide() {
    onMounted(() => {
      emit('update:hideAside', false);
    });

    onUnmounted(() => {
      emit('update:hideAside', true);
    });
  }
  return hide;
}

export default useLeftColumn;
