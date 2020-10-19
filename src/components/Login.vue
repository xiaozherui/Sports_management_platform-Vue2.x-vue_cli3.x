<template>
  <div class="login_container">
    <!-- 登录块 -->
    <div class="login_box">
      <div class="avatar_box">
        <!--头像-->
        <img src="../assets/logo.png" alt />
      </div>
      <!--添加表单-->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login_form"
        label-width="0px"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icondenglu"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <!-- 输入框中加入属性 type="password" 可以使得输入不可见 -->
          <el-input v-model="loginForm.password" prefix-icon="iconfont iconmima" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表单数据对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //表单验证对象
      loginRules: {
        //校验用户名的规则 触发条件blur表示失去焦点时进行校验
        username: [
          //必填项校验
          { required: true, message: '请输入用户名', trigger: 'blur' },
          //长度校验
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: 'blur',
          },
        ],
        //校验密码的规则
        password: [
          //必填项校验
          { required: true, message: '请输入密码', trigger: 'blur' },
          //长度校验
          { min: 6, max: 10, message: '密码为 6~10 位', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    //重置登录表单内容
    resetLoginForm() {
      //表单引用对象中有重置表单的方法resetFields()
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        //如果表单预验证是根据我们设置的表单验证规则取验证用户在输入框填入的信息是否正确
        //如果成功 ，valid会为true
        //如果表单按照设置的表单验证规则 验证失败了 valid会为false

        //如果验证失败就什么都不干 让方法中止
        if (!valid) return
        // 测试get请求后端是否能成功
        /* const { data } = await this.$http.get('test')
        console.log(data)
        if (data === 'ok') {
          this.$message.success('登录成功')
        } else {
          this.$message.error('登录失败')
        } */
        const { data: res } = await this.$http.post('login', this.loginForm) //访问后台
        if (res.flag === 'ok') {
          window.sessionStorage.setItem('flag', 'ok') // session 放置
          this.$message.success('登陆成功！！！')
          this.$router.push({ path: '/home' }) //前端路由跳转
          window.sessionStorage.setItem('user',res.user)//存储当前登录用户的user对象
          console.log(res.user)
        } else {
          this.$message.error('登录失败！！！')
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
// 跟节点样式
.login_container {
  background-color: #b0e0e6;
  height: 100%;
}
// 登录框
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px; // 圆角
  position: absolute; // 绝对定位
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); // 根据自己位置 以自己为长度位移
  // 头像框
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%; // 加圆角
    padding: 10px;
    box-shadow: 0 0 10px #ddd; // 盒子阴影
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #eee;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%; // 加圆角
      background-color: #eee;
    }
  }
  .btns {
    display: flex; // 弹性布局
    justify-content: flex-end; // 尾部对齐
  }
  .login_form {
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box; // 设置边框
  }
}
</style>