import { useRouter } from 'vue-router';
export function useTargetRouter(path: string, query = undefined) {
  const router = useRouter();
  console.log('router', router);
  let routerObj;
  if (query) {
    routerObj = {
      path,
      query: query,
    };
  } else {
    routerObj = { path };
  }
  console.log('routerObj', routerObj);
  // router.push(routerObj);
}
