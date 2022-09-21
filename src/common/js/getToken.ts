import { userInfoDefineStore } from './../../store/index';
// import { getUrlQuery } from './util';
import { router } from '../../router';
// import Store from '../../store';
import Axios from 'axios';
// import QS from 'qs';
import leansAxios from '../../http';
import storage from 'good-storage';

export function loginOut() {
  //退出登录
  //判断url是否为需要登录的页面，是就改写成index
  let url = deleteUrlCode();
  if (router.currentRoute.value.meta.needLogin) {
    url = window.location.origin + import.meta.env.DEV;
  }
  // 清空token
  // store.commit('setUid', '');
  storage.set('token', '');
  //退出登录的地址
  window.location.href = `${
    import.meta.env.VITE_APP_API
  }/sso/sso_logout?redirect_url=${url}&state=123`;
}

//处理链接，删除其中的code参数，然后返回其他部分
export function deleteUrlCode() {
  const query = window.location.search.substring(1);
  const queryArr = query.split('&');
  let str = '';
  for (let i = 0; i < queryArr.length; i++) {
    const r = queryArr[i].split('=');
    if (r[0] == 'code') {
      continue;
    }
    str += '&' + r.join('=');
  }
  let arr = window.location.href.split('?');
  let result = arr[0] + (arr.length === 1 ? '' : '?') + str.substring(1);
  // debugger;
  // result = encodeURIComponent(result);
  storage.set('redirect_uri', result);
  return result;
}

// 去登录函数
export function login(login_type = 'password', url = deleteUrlCode()) {
  //deleteUrlCode函数
  window.location.href = `${
    import.meta.env.VITE_APP_API
  }/sso/authorize?login_type=${login_type}&response_type=code&client_id=thy&redirect_uri=${url}`;
}

export function fetchGetToken(code: string) {
  // 获取token
  return new Promise((resolve) => {
    const url = storage.get('redirect_uri');
    Axios.post(`${import.meta.env.VITE_APP_API}/sso/token`, {
      client_id: 'thy',
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
          storage.set('token', token);

          // 请求接口，获取对应token的用户信息，并保存
          leansAxios
            .fetchPost('Mobile/User/userCenter', {
              uId: token,
            })
            .then((res: any) => {
              let data = res.data;
              if (data.code == 0) {
                const userInfoStore = userInfoDefineStore();
                userInfoStore.setUserInfo(data.data); //保存用户信息
                resolve(data.data);
              }
              // } else if (data.code == 201) {
              //   if (data.data.length == 0) {
              //     leansAxios
              //       .fetchPost('Mobile/User/userCenter', {
              //         uId: token,
              //       })
              //       .then((res: any) => {
              //         let data = res.data;
              //         if (data.code == 0) {
              //           store.dispatch('saveUserInfo', data.data);
              //         }
              //       });
              //   }
              // }
            });
        }
      })
      .catch((e) => {
        console.log('e', e);
        // Toast(e);
      });
  });
}
