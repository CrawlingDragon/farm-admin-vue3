import { userInfoDefineStore, loginState } from './../../store/index';
import { router } from '../../router';
import Axios from 'axios';
import leansAxios from '../../http/http';
import storage from 'good-storage';
import { UserCenterUrl } from './urls';
export { getUrlQuery } from './util';
export function loginOut() {
  //退出登录
  //判断url是否为需要登录的页面，是就改写成index
  let url = deleteUrlCode();
  // if (router.currentRoute.value.meta.needLogin) {
  //   url = window.location.origin + import.meta.env.DEV;
  // }
  // 清空token
  storage.set('token', '');
  // console.log('window.localStorage.getItem(token)', window.localStorage.getItem('token'));

  //退出登录的地址
  window.location.href = `${UserCenterUrl}/sso_logout?redirect_url=${url}&state=123`;
}

//处理链接，删除其中的code参数，然后返回其他部分
export function deleteUrlCode() {
  // const query = window.location.search.substring(1);
  // const queryArr = query.split('&');
  // let str = '';
  // for (let i = 0; i < queryArr.length; i++) {
  //   const r = queryArr[i].split('=');
  //   if (r[0] == 'code') {
  //     continue;
  //   }
  //   str += '&' + r.join('=');
  // }
  // let arr = window.location.href.split('?');
  // let result = arr[0] + (arr.length === 1 ? '' : '?') + str.substring(1);
  // debugger;
  // result = encodeURIComponent(result);
  const result = encodeURIComponent(window.location.origin + decodeURIComponent('/index'));
  storage.set('redirect_uri', result);
  return result;
}

// 去登录函数
export function login(login_type = 'password', url = deleteUrlCode()) {
  //deleteUrlCode函数
  window.location.href = `${UserCenterUrl}/authorize?login_type=${login_type}&response_type=code&client_id=ynb&redirect_uri=${url}`;
}

export function fetchGetToken(code: string) {
  // 获取token
  return new Promise((resolve) => {
    const url = storage.get('redirect_uri');
    Axios.post(`${UserCenterUrl}/token`, {
      client_id: 'ynb',
      grant_type: 'authorization_code',
      code: code,
      scope: '',
      // 当url有参数时，传过去的url需要deCode,但是在post请求时，参数url需要反decode，如下
      redirect_uri: decodeURIComponent(url),
    })
      .then((res) => {
        if (res.data.code === 500) {
          // 置空token，和尝试退出登录
          storage.set('token', '');
          loginOut();
          alert('获取token失败,请重新登录');
        } else if (res.status === 200) {
          // 保存token
          let token = res.data.access_token;
          // let tokenStorage = useStorage('token', '');
          // tokenStorage.value = token;
          storage.set('token', token);
          // let tokenStore = tokenDefineStore();
          // tokenStore.setToken(token);
          // 请求接口，获取对应token的用户信息，并保存
          leansAxios
            .fetchPost('/api/auth/userInfo', {
              token: token,
            })
            .then((res: any) => {
              let data = res.data;
              const loginStateStore = loginState();
              if (data.code == 200) {
                const userInfoStore = userInfoDefineStore();
                // console.log('data.data', data.data);
                userInfoStore.setUserInfo(data.data); // 保存用户信息
                loginStateStore.setLoginStates('agree'); //医院账户登录
                resolve(data.data);
              }
              if (data.code == 405) {
                loginStateStore.setLoginStates('refuse'); //非医院账户登录
              }
            });
        }
      })
      .catch((e) => {
        console.log('e', e);
        // Toast(e);
      });
  });
}
