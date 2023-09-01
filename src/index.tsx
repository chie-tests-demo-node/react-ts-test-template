import React from 'react'
import ReactDOM from 'react-dom/client'
// 定义当前项目的路由模式
import { BrowserRouter as Router } from 'react-router-dom'
import RouterView from './router';
import './index.less';

const root = ReactDOM.createRoot(document.getElementById('root') as any);
root.render(
  <Router>
    <RouterView />
  </Router>
);
