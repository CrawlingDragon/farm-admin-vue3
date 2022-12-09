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
  var dtmBirth: any;
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

// 用于el-table props 的数组
export function getTableKeys(obj: any) {
  let arr = [];
  for (let key in obj) {
    arr.push(key);
  }
  return arr;
}

export function initTransferData(arr: any[]) {
  // name: "冬枣",zuowuId: 442
  let newArr: any[] = [];
  arr.forEach((item) => {
    newArr.push(item.zuowuId);
  });
  return newArr;
}

export function transformImageParams(images: any[]) {
  if (images.length === 0) {
    return '';
  }
  let arr: any = [];
  images.forEach((item) => {
    arr.push(item.url);
  });
  return arr.join(',');
}

// 数组根据元素某个属性去重
export function duplicateRemoval(tempArr: any, key: string) {
  let newArr = [];
  for (let i = 0; i < tempArr.length; i++) {
    if (newArr.indexOf(tempArr[i][key]) == -1) {
      newArr.push(tempArr[i][key]);
    } else {
      tempArr.splice(i, 1);
      i--;
    };
  };
  return tempArr;
};
// js计算精度问题
export function calc(num1: any, num2: any, calcStr: any) {
  var str1, // 转换为字符串的数字
    str2,
    ws1 = 0,// ws1，ws2 用来存储传入的num的小数点后的数字的位数
    ws2 = 0,// 赋默认值，解决当整数和小数运算时倍数计算错误导致的结果误差 
    bigger,// bigger和smaller用于加，减，除法找出小的那个数字，给后面补0，解决位数不对从而造成的计算错误的问题；乘法需要将结果除两个数字的倍数之和
    smaller,// 例如：加减除法中1.001 + 2.03 ，如果不给2.03进行补0，最后会变成1001+203，数字错位导致结果错误；乘法中1.12*1.1会放大为112*11，所以结果需要除以1000才会是正确的结果，112*11/1000=1.232
    zeroCount, // 需要补充0的个数
    isExistDot1, // 传入的数字是否存在小数点
    isExistDot2,
    sum,
    beishu = 1;
  // 将数字转换为字符串
  str1 = num1.toString();
  str2 = num2.toString();
  // 是否存在小数点（判断需要计算的数字是不是包含小数）
  isExistDot1 = str1.indexOf('.') != -1 ? true : false;
  isExistDot2 = str2.indexOf('.') != -1 ? true : false;
  // 取小数点后面的位数
  if (isExistDot1) {
    ws1 = str1.split('.')[1].length;
  }

  if (isExistDot2) {
    ws2 = str2.split('.')[1].length;
  }
  // 如ws1 和 ws2 无默认值，如果num1 或 num2 不是小数的话则 ws1 或 ws2 的值将为 undefined 
  // bigger 和 smaller 的值会和预期不符
  bigger = ws1 > ws2 ? ws1 : ws2;
  smaller = ws1 < ws2 ? ws1 : ws2;

  switch (calcStr) {
    // 加减法找出小的那个数字，给后面补0，解决位数不对从而造成的计算错误的问题
    // 例如：1.001 + 2.03 ，如果不给2.03进行补0，最后会变成1001+203，数字错位导致结果错误
    case "+":
    case "-":
    case "/":
      zeroCount = bigger - smaller;
      for (var i = 0; i < zeroCount; i++) {
        if (ws1 == smaller) {
          str1 += "0";
        }
        else {
          str2 += "0";
        }
      }
      break;
    case "*":
      // 乘法需要将结果除两个数字的倍数之和
      bigger = bigger + smaller;
      break;
    default:
      return "暂不支持的计算类型，现已支持的有加法、减法、乘法、除法";
      break;
  }

  // 去除数字中的小数点
  str1 = str1.replace('.', '');
  str2 = str2.replace('.', '');

  // 计算倍数，例如：1.001小数点后有三位，则需要乘 1000 变成 1001，变成整数后精度丢失问题则不会存在
  for (var i = 0; i < bigger; i++) {
    beishu *= 10; // 等价于beishu = beishu * 10;
  }
  num1 = parseInt(str1);
  num2 = parseInt(str2);
  // 进行最终计算并除相应倍数
  switch (calcStr) {
    case "+":
      sum = (num1 + num2) / beishu;
      break;
    case "-":
      sum = (num1 - num2) / beishu;
      break;
    case "*":
      sum = (num1 * num2) / beishu;
      break;
    case "/":
      sum = num1 / num2;
      /* 除数与被除数同时放大一定倍数，不影响结果，
      所以对数字进行放大对应倍数并进行补0操作后不用另对倍数做处理 */
      break;
    default:
      return "暂不支持的计算类型，现已支持的有加法、减法、乘法、除法";
  }

  return sum;
}
// 整合自定义用药数组 和 后端用药数组
export function integrationMedicine(drugInfo: any) {
  let result: any = [];
  if (drugInfo.length === 0) {
    return;
  }
  drugInfo.forEach((item: any) => {
    result.push({
      drugName: item.drugName, //药品名字
      drugId: item.drugId, //药品id
      drugSpec: item.drugSpec,
      drugSpecIds: item.drugSpecIds, //药品规格
      sizeSelectOption: [],
      drugQuantity: +item.drugQuantity, // 药品数量
      selectMyself: false,
      drugPrice: item.drugPrice, //单价
    });
  });
  return result;
}
