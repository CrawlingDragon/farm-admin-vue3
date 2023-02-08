interface urls {
  vip_center: string;
  vip_admin: string;
  vip_base: string;
  hospital: string;
  fall_ill: string;
  video: string;
}
let dev_arr = {
  hospital: '', //庄稼医院
  fall_ill: '', //病虫害图库
  video: '', //农技视频
  vip_center: 'http://web.nzsoso.com/index.php?m=mpublic&c=business&a=init#-en', // 会员中心
  vip_admin: 'http://web.nzsoso.com/index.php?m=member&c=content&a=member_import_lists', // 会员管理
  // vip_base: 'http://beta.11236.org.cn/', //基地
  vip_base: 'https://betajdtong.114nz.com/', //基地
};
let prod_arr = {
  hospital: '', //庄稼医院
  fall_ill: '', //病虫害图库
  video: '', //农技视频
  vip_center: 'http://ai.114nz.com/index.php?m=mpublic&c=business&a=init#-en', // 会员中心
  vip_admin: 'http://ai.114nz.com/index.php?m=mpublic&c=com_index&userid=63580', // 会员管理
  // vip_base: 'http://ai.11236.org.cn/', //基地
  vip_base: 'https://jdtong.114nz.com/', //基地
};

export const urls: urls = import.meta.env.MODE === 'development' ? dev_arr : prod_arr;

// 个人中心 前置域名
export const UserCenterUrl =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_USER_CENTER_URL
    : import.meta.env.VITE_APP_USER_CENTER_URL;
