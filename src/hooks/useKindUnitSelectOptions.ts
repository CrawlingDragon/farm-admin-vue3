import { ref, onMounted, toRefs, reactive } from 'vue';
// import { get } from '@/http/http';
import { getSelectInfo } from '@/http';
export function useKindUnitSelectOptions() {
  const kindOptions = ref([]); //种类的select options
  const unitOptions = ref([]);
  // const options = reactive({
  //   kindOptions: [],
  //   unitOptions: [],
  // });

  async function setUnitAndKindSelectData() {
    let { unitArr, categoryArr } = await getSelectInfo();
    unitOptions.value = unitArr;
    // console.log('expertList', expertList);
    // selectOptions.recipeTemList = recipeTemList;
    kindOptions.value = categoryArr;
    // options.kindOptions = categoryArr;
    // options.unitOptions = unitArr;
    // console.log('kindOptions', kindOptions);
  }
  onMounted(() => {
    setUnitAndKindSelectData();
  });

  return { kindOptions, unitOptions };
}
