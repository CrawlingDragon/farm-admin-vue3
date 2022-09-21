// 获取url的特定参数的值
export function getUrlQuery(key: string) {
  const query = window.location.search.substring(1);
  const queryArr = query.split('&');
  for (let i = 0; i < queryArr.length; i++) {
    const r = queryArr[i].split('=');
    if (r[0] === key) {
      return r[1];
    }
  }
  return false;
}
// 申请会员的身份证验证
export function isCardNo(num: any) {
  num = num.toUpperCase();
  //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
  if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) {
    return false;
  }
  //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
  //下面分别分析出生日期和校验位
  var len, re;
  len = num.length;
  var bCorrectDay;
  var arrSplit;
  var dtmBirth;
  if (len == 15) {
    re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
    arrSplit = num.match(re);

    //检查生日日期是否正确
    dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);

    bCorrectDay =
      dtmBirth.getYear() == Number(arrSplit[2]) &&
      dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
      dtmBirth.getDate() == Number(arrSplit[4]);
    if (!bCorrectDay) {
      return false;
    } else {
      //将15位身份证转成18位
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
      var nTemp = 0,
        i;
      num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
      for (i = 0; i < 17; i++) {
        nTemp += num.substr(i, 1) * arrInt[i];
      }
      num += arrCh[nTemp % 11];
      return true;
    }
  } else if (len == 18) {
    re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
    arrSplit = num.match(re);

    //检查生日日期是否正确
    var xx = new Date(arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
    bCorrectDay =
      xx.getFullYear() == Number(arrSplit[2]) &&
      xx.getMonth() + 1 == Number(arrSplit[3]) &&
      xx.getDate() == Number(arrSplit[4]);
    if (!bCorrectDay) {
      return false;
    } else {
      //检验18位身份证的校验码是否正确。
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var valnum;
      arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
      arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
      nTemp = 0;

      for (var x = 0; x < 17; x++) {
        nTemp += num.substr(x, 1) * arrInt[x];
      }
      valnum = arrCh[nTemp % 11];
      if (valnum != num.substr(17, 1)) {
        return false;
      }
      return true;
    }
  }
  return false;
}
export const getAssetsImage = (name: string) => {
  return new URL(`/src/assets/${name}`, import.meta.url).href;
};
// import EXIF from 'exif-js';
// export function inWeixin() {
//   var ua = navigator.userAgent.toLowerCase();
//   if (ua.match(/MicroMessenger/i) == 'micromessenger') {
//     return true;
//   } else {
//     return false;
//   }
// }

// export function getIsApp() {
//   var ua = navigator.userAgent.toLowerCase();
//   if (ua.match(/isapp/i) == 'isapp') {
//     return true;
//   }
//   return false;
// }
// export function exifImg(file) {
//   return new Promise((resolve) => {
//     EXIF.getData(file, function () {
//       let Orientation;
//       Orientation = EXIF.getTag(this, 'Orientation');
//       imgPress({ file: file, Orientation: Orientation }).then((res) => {
//         resolve(res.filePress);
//       });
//     });
//   });
// }
// function imgPress({ file, Orientation, rate = 1, maxSize = 20800, fileType = 'file' }) {
//   let that = this;
//   return new Promise((resolve) => {
//     // new一个文件读取方法，监听文件读取
//     let reader = new FileReader();
//     reader.readAsDataURL(file);
//     let img = new Image();
//     reader.onload = function (e) {
//       img.src = e.target.result;
//     };
//     img.onload = function () {
//       let canvas = document.createElement('canvas');
//       // let context = canvas.getContext('2d')
//       // 文件大小KB
//       const fileSizeKB = file.size / 1024;
//       // 配置rate和maxSize的关系
//       if (fileSizeKB * rate > maxSize) {
//         rate = Math.floor((maxSize / fileSizeKB) * 10) / 10;
//       }
//       // 缩放比例，默认0.5
//       // let targetW = canvas.width = this.width * rate
//       // let targetH = canvas.height = this.height * rate
//       // context.clearRect(0, 0, targetW, targetH)
//       // context.drawImage(img, 0, 0, targetW, targetH)
//       let width = this.width;
//       let height = this.height;
//       canvas.width = width;
//       canvas.height = height;
//       if (Orientation && Orientation != 1) {
//         switch (Orientation) {
//           case 6: // 旋转90度
//             canvas.width = this.height;
//             canvas.height = this.width;
//             that.rotateImg(img, 'left', canvas, width, height);
//             break;
//           case 3: // 旋转180度
//             rotateImg(img, 'right2', canvas, width, height);
//             break;
//           case 8: // 旋转-90度
//             rotateImg(img, 'right2', canvas, width, height);
//             break;
//           default:
//             canvas.getContext('2d').drawImage(img, 0, 0, width, height);
//             break;
//         }
//       } else {
//         canvas.getContext('2d').drawImage(img, 0, 0, width, height);
//       }

//       if (fileType === 'file' || fileType === 'blob') {
//         canvas.toBlob(
//           function (blob) {
//             resolve({
//               filePress:
//                 fileType === 'blob'
//                   ? blob
//                   : new File([blob], file.name, { type: file.type }),
//               base64: img.src,
//             });
//           },
//           'image/jpeg',
//           0.4
//         );
//       } else {
//         resolve({
//           filePress: fileType === 'base64' ? canvas.toDataURL(file.type) : null,
//           base64: img.src,
//         });
//       }
//     };
//   });
// }
// function rotateImg(img, direction, canvas, width, height) {
//   var min_step = 0;
//   var max_step = 3;
//   if (img == null) {
//     return;
//   }
//   var step = 2;
//   if (step == null) {
//     step = min_step;
//   }
//   if (direction == 'right') {
//     step++;
//     step > max_step && (step = min_step);
//   } else if (direction == 'right2') {
//     step = 2;
//   } else {
//     step--;
//     step < min_step && (step = max_step);
//   }
//   var degree = (step * 90 * Math.PI) / 180;
//   var ctx = canvas.getContext('2d');
//   switch (step) {
//     case 0:
//       canvas.width = width;
//       canvas.height = height;
//       ctx.drawImage(img, 0, 0, width, height);
//       break;
//     case 1:
//       canvas.width = height;
//       canvas.height = width;
//       ctx.rotate(degree);
//       ctx.drawImage(img, 0, -height, width, height);
//       break;
//     case 2:
//       canvas.width = width;
//       canvas.height = height;
//       ctx.rotate(degree);
//       ctx.drawImage(img, -width, -height, width, height);
//       break;
//     case 3:
//       canvas.width = height;
//       canvas.height = width;
//       ctx.rotate(degree);
//       ctx.drawImage(img, -width, 0, width, height);
//       break;
//   }
// }
