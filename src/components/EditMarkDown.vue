<template>
  <v-md-editor v-model="props.modelValue"
               :height="height+'px'"
               :disabled-menus="[]"
               :include-level="[ 2, 3, 4, 5, 6]"
               @upload-image="handleUploadImage"
               @save="save"
               left-toolbar="undo redo clear |emoji h bold italic strikethrough quote | ul ol table hr | link image code | save"
               @change="change"></v-md-editor>
</template>

<script setup>
// http://ckang1229.gitee.io/vue-markdown-editor
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import UploadApi from "../api/uploadApi.js";
import {getCurrentInstance} from "vue";
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import java from 'highlight.js/lib/languages/java';
import xml from 'highlight.js/lib/languages/xml';
import sql from 'highlight.js/lib/languages/sql';
import javascript from 'highlight.js/lib/languages/javascript';
import shell from 'highlight.js/lib/languages/shell';
import nginx from 'highlight.js/lib/languages/nginx';
import css from 'highlight.js/lib/languages/css';
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

hljs.registerLanguage('json', json);
hljs.registerLanguage('java', java);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('sh', shell);
hljs.registerLanguage('nginx', nginx);
hljs.registerLanguage('css', css);

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
VMdEditor.use(createCopyCodePlugin());
VMdEditor.use(createEmojiPlugin());
VMdEditor.use(createLineNumbertPlugin());

const emit = defineEmits();
const change = (text, html) => {
  emit("update:modelValue", text)
}

const props = defineProps({
  modelValue: {
    type: String,
    default: "# :warning:编辑器内图片无缓存存储区，一经上传永久存储，为了节省服务器磁盘空间，请谨慎上传:warning:\n如有删除请记录文件存储位置联系管理员删除"
  },
  save: Function,
  height: {
    type: Number,
    default: 500
  }
})
const {proxy} = getCurrentInstance();
const handleUploadImage = (event, insertImage, files) => {
  UploadApi.uploadInMarkDown({file: files[0]}).then((result) => {
    if (result) {
      insertImage({
        url: proxy.globalUrl.imgUrl + result.data,
        desc: '图片',
      });
    }
  })
}

</script>

<style scoped>

</style>