interface urls {
  hospital: string;
  fall_ill: string;
  video: string;
  farm_store: string; //农资商城
  farm_medicine: string; //农药
  farm_manure: string; //肥料
  farm_membrane: string; //农膜
  farm_index: string; //中农在线官网
  change_password: string;
  vip_base: string;
}
// 农资商城;
// 农药;
// 肥料;
// 农膜;
let dev_arr = {
  hospital: 'https://beta-ai.114nz.com/hospital', //庄稼医院
  fall_ill: 'https://beta-ai.114nz.com/fall-ill', //病虫害图库
  video: 'https://beta-ai.114nz.com/video', //农技视频
  farm_store: 'https://mall.114nz.com/Index/Index/index.html', //农资商城
  farm_medicine: 'https://mall.114nz.com/Index/Category/index/id/2.html', //农药
  farm_manure: 'https://mall.114nz.com/Index/Category/index/id/1.html', //肥料
  farm_membrane: 'https://mall.114nz.com/Index/Category/index/id/32.html', //农膜
  farm_index: 'https://www.114nz.com/',
  change_password: 'https://beta-ai.114nz.com/change-password', //修改密码
  vip_base: 'https://betajdtong.114nz.com/', //基地管理中心
};
let prod_arr = {
  hospital: 'https://beta-ai.114nz.com/hospital', //庄稼医院
  fall_ill: 'https://beta-ai.114nz.com/fall-ill', //病虫害图库
  video: 'https://beta-ai.114nz.com/video', //农技视频
  farm_store: 'https://mall.114nz.com/Index/Index/index.html', //农资商城
  farm_medicine: 'https://mall.114nz.com/Index/Category/index/id/2.html', //农药
  farm_manure: 'https://mall.114nz.com/Index/Category/index/id/1.html', //肥料
  farm_membrane: 'https://mall.114nz.com/Index/Category/index/id/32.html', //农膜
  farm_index: 'https://www.114nz.com/',
  change_password: 'https://beta-ai.114nz.com/change-password', //修改密码
  vip_base: 'https://betajdtong.114nz.com/', //基地管理中心
};

export const urls: urls = import.meta.env.MODE === 'development' ? dev_arr : prod_arr;

// 个人中心 前置域名
export const UserCenterUrl =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_USER_CENTER_URL
    : import.meta.env.VITE_APP_USER_CENTER_URL;
