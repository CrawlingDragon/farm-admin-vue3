import { fetchGet } from './http';
import { UserCenterUrl } from '../common/js/urls';
import storage from 'good-storage';
import { getUrlQuery } from '../common/js/getToken';

export function fetchGetToken() {
  const url = storage.get('redirect_uri');
  const code = getUrlQuery('code');
  const token = storage.get('token');
  if (token != '') {
    return false;
  }
  // 获取token
  return fetchGet(`${UserCenterUrl}/token`, {
    client_id: 'ynb',
    grant_type: 'authorization_code',
    code: code,
    scope: '',
    redirect_uri: decodeURIComponent(url),
  });

  // return new Promise((resolve) => {
  //   const url = storage.get('redirect_uri');
  //   Axios.post(`${UserCenterUrl}/token`, {
  //     client_id: 'ynb',
  //     grant_type: 'authorization_code',
  //     code: code,
  //     scope: '',
  //     // 当url有参数时，传过去的url需要deCode,但是在post请求时，参数url需要反decode，如下
  //     redirect_uri: decodeURIComponent(url),
  //   })
  //     .then((res) => {
  //       if (res.data.code === 500) {
  //         // 置空token，和尝试退出登录
  //         storage.set('token', '');
  //         loginOut();
  //         alert('获取token失败,请重新登录');
  //       } else if (res.status === 200) {
  //         // 保存token
  //         let token = res.data.access_token;
  //         let tokenStorage = useStorage('token', '');
  //         tokenStorage.value = token;
  //         storage.set('token', token);
  //         // 请求接口，获取对应token的用户信息，并保存
  //         leansAxios
  //           .fetchPost('/api/auth/userInfo', {
  //             token: token,
  //           })
  //           .then((res: any) => {
  //             let data = res.data;
  //             if (data.code == 200) {
  //               const userInfoStore = userInfoDefineStore();
  //               userInfoStore.setUserInfo(data.data); //保存用户信息
  //               resolve(data.data);
  //             }
  //           });
  //       }
  //     })
  //     .catch((e) => {
  //       console.log('e', e);
  //       // Toast(e);
  //     });
  // });
}
