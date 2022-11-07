import { getAliossCount } from '@/http';
import OSS from 'ali-oss';
export function alioss(): any {
  let client: any;
  let action: any;
  async function getAccount() {
    let { alioss } = await getAliossCount();
    let { accessKeyId, accessKeySecret, bucket, region, stsToken } = alioss;
    client = new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
      region,
      // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
      accessKeyId,
      accessKeySecret,
      // 从STS服务获取的安全令牌（SecurityToken）。
      stsToken,
      // 填写Bucket名称。
      bucket,
    });
    action = 'http://' + client.options.bucket + '.' + client.options.endpoint.host;
    // console.log('client', client.options.endpoint.host);
    return Promise.resolve(action);
    // console.log('href', action);
  }
  // let r = getAccount();

  const headers = {
    // 指定该Object被下载时网页的缓存行为。
    // 'Cache-Control': 'no-cache',
    // 指定该Object被下载时的名称。
    // 'Content-Disposition': 'oss_download.txt',
    // 指定该Object被下载时的内容编码格式。
    // 'Content-Encoding': 'UTF-8',
    // 指定过期时间。
    // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT',
    // 指定Object的存储类型。
    // 'x-oss-storage-class': 'Standard',
    // 指定Object的访问权限。
    // 'x-oss-object-acl': 'private',
    // 设置Object的标签，可同时设置多个标签。
    // 'x-oss-tagging': 'Tag1=1&Tag2=2',
    // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
    // 'x-oss-forbid-overwrite': 'true',
  };
  async function putObject(data: any) {
    try {
      // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
      // 您可以通过自定义文件名（例如exampleobject.txt）或文件完整路径（例如exampledir/exampleobject.txt）的形式实现将数据上传到当前Bucket或Bucket中的指定目录。
      // data对象可以自定义为file对象、Blob数据或者OSS Buffer。

      const result = await client.put('/test.png', data, { headers });
      // console.log(result);
      return Promise.resolve(result.url);
    } catch (e) {
      console.log('alioss--e', e);
      return Promise.reject(300);
    }
  }
  return {
    putObject,
    getAccount,
  };
}
