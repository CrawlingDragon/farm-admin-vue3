import { ref, onMounted } from 'vue';
import { getTestExpert } from '@/http';
export function useExpertTemplateTestSelectOptions() {
  const expertListArr = ref([]);
  const cetuOrderListArr = ref([]);
  const recipeTemListArr = ref([]);
  // const options = reactive({
  //   kindOptions: [],
  //   unitOptions: [],
  // });

  async function setUnitAndKindSelectData() {
    let { expertList, recipeTemList, cetuOrderList } = await getTestExpert();

    // console.log('expertList', expertList);
    expertListArr.value = expertList;
    recipeTemListArr.value = recipeTemList;
    cetuOrderListArr.value = cetuOrderList;
  }
  onMounted(() => {
    setUnitAndKindSelectData();
  });

  return { expertListArr, cetuOrderListArr, recipeTemListArr };
}
