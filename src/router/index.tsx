import React from 'react'
// 定义路由规则 Route用来定义路由规则的，它一定要在Routes组件中包裹起来，否则报错
import { Routes, Route, Navigate, } from 'react-router-dom'

// 路由匹配成功后要渲染的组件
import Login from '../pages/Login'
import LayoutViews from '../layout'

const RouterView = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/layout' element={<LayoutViews />} />
        {/* 重定向 */}
        <Route path="/" element={<Navigate to="/home" replace={false} />} />
        {/* 404页面处理 */}
        <Route path="*" element={<div>没有页面</div>} />
      </Routes>
    </div>
  )
}

export default RouterView
