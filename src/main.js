import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/style.css'

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
// import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
// import '@kangc/v-md-editor/lib/theme/style/github.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';

// highlightjs
import hljs from 'highlight.js';

VMdEditor.use(vuepressTheme, {
  Hljs: hljs,
  Prism
});


createApp(App).use(router).use(VMdEditor).mount('#app')
