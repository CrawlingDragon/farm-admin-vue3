<template>
  <div class="border" style="margin-bottom: 50px">
    <div class="nav-bar">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/serve-message' }">信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">
      <div class="content-form">
        <el-form :rules="rules" ref="ruleFormRef" label-width="118px" size="large" :model="ruleForm">
          <el-form-item label="标题:" prop="title">
            <el-input v-model="ruleForm.title" size="large" maxlength="18" show-word-limit class="w300 m-2 mr20"
              placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="关键词:" prop="keywords">
            <el-input v-model="ruleForm.keywords" size="large" class="w300 m-2 mr20" placeholder="请输入关键词"></el-input>
          </el-form-item>
          <el-form-item label="内容:" prop="content">
            <RichText v-model:valueHtml="ruleForm.content"></RichText>
          </el-form-item>
          <el-form-item label="缩略图:" prop="thumb">
            <UploadImageVue :limit="1" v-model:images="ruleForm.thumb" />
          </el-form-item>
        </el-form>
      </div>

      <div class="submit-bar">
        <div class="content">
          <el-button type="primary" size="large" class="mr20" @click="saveMessage(ruleFormRef)">保存</el-button>
          <el-button size="large" @click="goLink('/serve-message')">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { getSaveNews, getNewsInfo } from '@/http';
import UploadImageVue from '@/components/uploadImage.vue';
import { ElMessage } from 'element-plus';
import RichText from '@/components/richText.vue';

const router = useRouter();
const route = useRoute();
const id = computed(() => {
  if (route.query.id) {
    return route.query.id;
  } else {
    return '';
  }
});
const title = ref('信息编辑');
const emit = defineEmits(['update:hideAside']);
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  keywords: [{ required: false }],
  thumb: [{ required: false }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
});
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<any>({
  title: '', //标题
  keywords: '', //关键词
  content: '', //信息内容
  thumb: [{ url: '' }], //缩略图链接
});
// const valueHtmls = ref('')
onMounted(async () => {
  setNewsInfo();
  emit('update:hideAside', false);
});
// 隐藏侧边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});

// 跳转页面
function goLink(params: string) {
  router.push({
    path: params,
  });
}
// 获取详情信息
async function setNewsInfo() {
  if (id.value) {
    title.value = '信息编辑';
    let r = await getNewsInfo({ newId: id.value });
    // console.log('r', r)
    if (r.code == 404) {
      ElMessage.error(r.msg);
      setTimeout(() => {
        router.go(-1);
      }, 1000);
    }
    ruleForm.title = r.title;
    ruleForm.keywords = r.keywords;
    ruleForm.content = r.content;
    ruleForm.thumb = r.thumb == '' ? [] : [{ url: r.thumb }];
  } else {
    title.value = '发布信息';
    ruleForm.thumb = []
  }
}
const params = computed(() => {
  // newId: String(id.value),
  let param = {
    newId: String(id.value),
    title: ruleForm.title,
    keywords: ruleForm.keywords,
    content: ruleForm.content,
    thumb: ruleForm.thumb.length === 0 ? '' : ruleForm.thumb[0].url,
  };
  return param;
});
// 保存提交方法
async function setSaveNews() {
  // console.log('params', params.value)
  let r = await getSaveNews(params.value);
  if (r.code) {
    ElMessage.error(r.msg);
  } else {
    if (id.value) {
      ElMessage.success('保存成功');
    } else {
      ElMessage.success('发布成功');
    }
    setTimeout(() => {
      router.push({
        path: '/serve-message',
      });
    }, 1000);
  }
}

// 保存
async function saveMessage(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      setSaveNews();
    } else {
      ElMessage.warning('提交失败,请修改后再提交');
      console.log('error submit!', fields);
    }
  });
}
</script>

<style lang="scss" scoped>
.nav-bar {
  height: 40px;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  padding-left: 20px;
  border-bottom: 1px solid $border-color;
}

.content-box {
  background: #fff;
  padding-top: 20px;
  padding-bottom: 20px;

  .content-form {
    min-height: 65vh;
  }
}

.submit-bar {
  z-index: 101;
}
</style>
