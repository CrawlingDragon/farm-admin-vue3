<template>
  <div style="border: 1px solid #ccc; width: 100%; z-index: 100">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
    />
    <Editor
      style="height: 400px; overflow-y: hidden"
      v-model="valueHtmlCount"
      :defaultConfig="editorConfig"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from 'vue';
import { IToolbarConfig, IEditorConfig, IDomEditor } from '@wangeditor/editor';
import { getAliossCount } from '@/http';
import OSS from 'ali-oss';

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const props = defineProps({
  valueHtml: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:valueHtml']);
// 内容
const valueHtmlCount = ref(props.valueHtml);
watch(
  () => props.valueHtml,
  (newVal) => {
    // console.log('newVal', newVal);
    valueHtmlCount.value = newVal;
  }
);
// 上传阿里云方法
let client = ref<any>({});
onMounted(async () => {
  let { alioss } = await getAliossCount();
  // console.log('alioss', alioss);
  let { accessKeyId, accessKeySecret, bucket, region, stsToken } = alioss;
  client.value = new OSS({
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
});
const toolbarConfig: Partial<IToolbarConfig> = {
  /* 工具栏配置 */
  toolbarKeys: [
    'redo',
    'undo',
    '|',
    'headerSelect',
    'bold',
    'italic',
    'underline',
    'fontSize',
    'fontFamily',
    'color',
    'bgColor',
    'through',
    'sub',
    'sup',
    'clearStyle',
    'lineHeight',
    'insertLink',
    'divider',
    'emotion',
    'blockquote',
    'justifyLeft',
    'justifyRight',
    'justifyCenter',
    'justifyJustify',
    {
      key: 'group-image', // 必填，要以 group 开头
      title: '图片', // 必填
      iconSvg: '',
      menuKeys: ['uploadImage', 'deleteImage'],
    },
    'fullScreen',
  ],
  // toolbarKeys: ['bold', 'underline', 'italic', 'through', 'code', 'sub', 'sup', 'clearStyle', 'color',
  //   'bgColor', 'fontSize', 'fontFamily', 'indent', 'delIndent', 'justifyLeft', 'justifyRight',
  //   'justifyCenter', 'justifyJustify', 'lineHeight', 'insertImage', 'deleteImage', 'editImage', 'viewImageLink',
  //   'imageWidth30', 'imageWidth50', 'imageWidth100', 'divider', 'emotion', 'insertLink', 'editLink', 'unLink',
  //   'viewLink', 'codeBlock', 'blockquote', 'headerSelect', 'header1', 'header2', 'header3', 'header4', 'header5',
  //   'todo', 'redo', 'undo', 'fullScreen', 'enter', 'bulletedList', 'numberedList', 'insertTable', 'deleteTable',
  //   'insertTableRow', 'deleteTableRow', 'insertTableCol', 'deleteTableCol', 'tableHeader', 'tableFullWidth',
  //   'insertVideo', 'uploadVideo', 'editVideoSize', 'uploadImage', 'codeSelectLang']
};
type InsertFnType = (url: string) => void;
const editorConfig: Partial<IEditorConfig> = {
  MENU_CONF: {
    // 行高
    lineHeight: {
      lineHeightList: ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4'],
    },
    // 字体
    //   fontFamily: {
    //     fontFamilyList: ['黑体',
    //       '楷体']
    //   },
    uploadImage: {
      async customUpload(file: any, insertFn: InsertFnType) {
        let date = new Date().getTime();
        let filepath = 'nft/' + date + '/' + file.name;
        // file 即选中的文件
        client.value
          .put(filepath, file)
          .then(function (res: any) {
            // 上传图片，返回结果，将图片插入到编辑器中
            insertFn(res.url);
          })
          .catch(function (err: any) {
            console.log(err);
          });
      },
    },
  },
  placeholder: '请输入内容...',
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
const handleCreated = (editor: IDomEditor) => {
  if (editor == null) return;
  editorRef.value = editor; // 记录 editor 实例，重要！
  // console.log('editor', editor)
};
const handleChange = (editor: IDomEditor) => {
  if (editor == null) return;
  if (valueHtmlCount.value != '<p><br></p>') {
    emit('update:valueHtml', valueHtmlCount);
    // console.log('valueHtmlCount', valueHtmlCount.value)
  } else {
    emit('update:valueHtml', '');
  }
};
</script>
<style lang="scss" scoped></style>
