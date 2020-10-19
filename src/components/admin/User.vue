<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="25">
        <el-col :span="10">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <el-table-column label="状态" prop="state">
          <!-- scope.row 就是当前行的信息 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 权限 -->
            <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 3, 5, 7 , 9 ,15]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @colse="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询信息实体 作为查询列表请求的提交参数
      queryInfo: {
        query: '', //模糊查询需要的内容（即在搜索框输入的内容）
        pageNum: 1,
        pageSize: 5,
      },
      userlist: [], // 用户列表

      total: 0, // 最大数据记录
      addDialogVisible: false, // 对话框显示
      // 添加用户表单项
      addForm: {
        username: '',
        password: '',
        email: '',
      },
      // 控制修改用户对话框显示/隐藏
      editDialogVisible: false,
      // 修改用户信息
      editForm: {},
      // 验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '长度在 6 到 18 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 5, max: 15, message: '请输入正确邮箱地址', trigger: 'blur' },
        ],
      },
      // 修改用户表单验证规则
      editFormRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 5, max: 15, message: '请输入正确邮箱地址', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // 调用post请求
      const { data: res } = await this.$http.post('allUser', this.queryInfo)
      console.log(res)
      //res中有个data数组和numbers 即类似 {data: Array(5), numbers: 7}
      this.userlist = res.data // 将返回数据赋值
      this.total = res.numbers // 总个数
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList() // 数据发生改变重新申请数据
    },
    // 监听pageNum改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getUserList() // 数据发生改变重新申请数据
    },
    // 修改用户状态
    // 传入的参数为当前行的user对象scope.row
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `userState?id=${userinfo.id}&state=${userinfo.state}` //模板字符串``
      )
      console.log(res)
      if (res != 'success') {
        //如果后台修改数据库中的状态失败
        userinfo.state = !userinfo.state //把页面上修改过的状态改回原状态（不是改数据库只是改页面上的）
        return this.$message.error('修改用户状态失败！！！')
      }
      //修改成功后可以用navicat查看到数据库中对应用户的状态发生了改变
      this.$message.success('修改用户状态成功！！！')
    },
    // 监听添加用户
    addDialogClosed() {
      this.$refs.addFormRef.resetFields() // 重置表单项
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(valid)
        if (!valid) return
        // 发起请求
        const { data: res } = await this.$http.post('addUser', this.addForm)
        console.log('添加用户请求到的后端数据为：' + res)
        if (res != 'success') {
          return this.$message.error('添加用户失败！！！')
        }
        this.$message.success('添加用户成功！！！')
        //隐藏添加用户的对话框
        this.addDialogVisible = false
        //获取新的用户列表
        this.getUserList()
      })
    },
    // 展示修改框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('getUpdateUser?id=' + id)
      // if (res != "success") {
      // userinfo.state = !userinfo.state;
      // return this.$message.error("操作失败！！！");
      // }
      // this.$message.success("操作成功！！！");

      this.editForm = res
      this.editDialogVisible = true
    },
    // 关闭窗口
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 确认修改
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(valid)
        if (!valid) return
        // 发起请求
        const { data: res } = await this.$http.put('editUser', this.editForm)
        console.log(res)
        if (res != 'success') return this.$message.error('操作失败！！！')
        this.$message.success('操作成功！！！')
        //隐藏
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    // 删除按钮
    async deleteUser(id) {
      // 弹框
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // 成功删除为confirm 取消为 cancel
      if (confirmResult != 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('deleteUser?id=' + id)
      if (res != 'success') {
        return this.$message.error('操作失败！！！')
      }
      this.$message.success('操作成功！！！')
      this.getUserList()
    },
  },
}
</script>
<style lang="less" scoped>
</style>