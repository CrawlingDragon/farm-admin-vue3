<template>
  <div class="mb50">
    <div class="nav-bar border">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/set/hospital-info' }">医院设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/set/hospital-TV' }">TV广告图设置</el-breadcrumb-item>
        <el-breadcrumb-item>{{
          routeName === 'hospital-TV-add' ? '新增广告图' : '编辑广告图'
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="content">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        size="large"
        status-icon
      >
        <div class="top-box bg-w border">
          <div class="left-bar">
            <div class="tip">广告图信息</div>

            <el-form-item label="标题:" prop="title">
              <el-input
                placeholder="输入标题"
                v-model="ruleForm.title"
                class="w300"
                maxlength="18"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="图片:" prop="images">
              <UploadImageVue :limit="1" v-model:images="ruleForm.images" />
              <div class="tips">尺寸建议:850px*420px</div>
            </el-form-item>
            <el-form-item label="排序:" prop="listorder">
              <el-radio-group v-model="ruleForm.listorder">
                <el-radio :label="1">1</el-radio>
                <el-radio :label="2">2</el-radio>
                <el-radio :label="3">3</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="内容:" prop="content">
              <RichText v-model:valueHtml="ruleForm.content"></RichText>
            </el-form-item>
          </div>
        </div>

        <div class="submit-bar" v-if="routeName == 'hospital-TV-add'">
          <div class="content">
            <el-button type="primary" size="large" @click="submitForm(ruleFormRef)" class="mr20"
              >确定添加</el-button
            >
            <el-button size="large" @click="cancel">取消</el-button>
          </div>
        </div>
        <div class="submit-bar" v-else>
          <div class="content">
            <el-button
              type="primary"
              size="large"
              @click="submitForm(ruleFormRef, 'goPage')"
              class="mr20"
              >保存</el-button
            >
            <el-button size="large" @click="delTVFn" class="mr20">删除</el-button>
            <el-button size="large" @click="cancel">取消</el-button>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue';
import { ElMessage, UploadProps, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { getTvDetail, getAddEditTv, getTvDel } from '@/http';
import UploadImageVue from '@/components/uploadImage.vue';
import { transformImageParams } from '@/common/js/util';
import RichText from '@/components/richText.vue';
// 隐藏左边栏

const route = useRoute();

const adId = computed(() => route.params.adId);
const routeName = computed(() => route.name);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  title: '',
  images: [] as any,
  listorder: 1,
  content: '',
});

const rules = reactive<FormRules>({
  nameId: [{ required: true, message: '会员不能为空', trigger: 'change' }],
});

const router = useRouter();
const submitForm = async (formEl: FormInstance | undefined, goPage?: string) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let r = setTVData().then((res) => {});
    } else {
      ElMessage.warning('提交失败,请修改后再提交');
      console.log('error submit!', fields);
    }
  });
};
//删除广告
const delTVFn = () => {
  ElMessageBox.confirm('确定删除该广告图', '删除提示')
    .then(async (res) => {
      let r = await getTvDel(adId.value as any);
      if (r.code) {
        ElMessage.error(r.msg);
      } else {
        ElMessage.success('已删除');
        router.replace({
          path: '/set/hospital-TV',
        });
      }
    })
    .catch((e) => {});
};
// 取消按钮
const cancel = function () {
  router.replace({
    path: '/set/hospital-TV',
  });
};

const soilParams = computed<any>(() => {
  let params = {
    adId: adId.value == undefined ? '' : adId.value,
    title: ruleForm.title,
    images: ruleForm.images.length === 0 ? '' : ruleForm.images[0].url,
    listorder: ruleForm.listorder,
    content: ruleForm.content,
  };
  return params;
});

// 提价测土结果请求
async function setTVData() {
  let r = await getAddEditTv(soilParams.value);
  // console.log('r', r);
  if (r.code) {
    ElMessage.error(r.msg);
  } else {
    ElMessage.success('已经添加');
    router.push({ path: '/set/hospital-TV' });
  }
}

async function getZuozhenDetail() {
  // 没有zuozhenId，说明是新增页面不需要请求详情数据
  if (!adId.value) {
    ruleForm.images = []
    return;
  };
  let r = await getTvDetail(adId.value as any);
  // console.log('r', r);
  ruleForm.title = r.title;
  ruleForm.images = r.images == '' ? [] : [{ url: r.images }];
  ruleForm.listorder = r.listorder;
  ruleForm.content = r.content;
}
onMounted(async () => {
  getZuozhenDetail();
});
</script>
<style lang="scss" scoped>
.nav-bar {
  border-bottom: none;
}
.top-box {
  display: flex;
  justify-content: space-between;
  & > div {
    flex: 1;
  }
  .right-bar {
    .right-box {
      background: #f8f8f8;
      margin: 10px;
    }
  }
        .tips {
          font-size: 12px;
          color: $f-color-three;
          padding-left: 10px;
        }
}

.tip {
  position: relative;
  display: flex;
  align-items: center;
  .open-Prescribing {
    margin-left: 44px;
    // position: absolute;
    // top
  }
}
</style>
