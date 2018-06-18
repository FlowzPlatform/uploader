<template>
  <div class="addconfig" v-if="isShow">
    <h1 v-if="formItem.id">Edit {{this.$route.params.type.toUpperCase()}} Credential</h1>
    <h1 v-else>Add {{this.$route.params.type.toUpperCase()}} Credential</h1>
    <hr>
    <div style="margin-top:10px;border: 1px solid #C0C0C0;padding:20px">
      <Form :model="formItem" :label-width="300" ref="formItem" :rules="rulesformItem">
        <FormItem label="Name" prop="name">
            <Input v-model.trim="formItem.name" placeholder="Name"></Input>
        </FormItem>
        <FormItem :label="getLabel" prop="number">
            <Input v-model.trim="formItem.number" placeholder="Number"></Input>
        </FormItem>
        <FormItem label="User" prop="user">
            <Input v-model.trim="formItem.user" placeholder="User"></Input>
        </FormItem>    
        <FormItem label="Password" prop="password">
            <Input v-model.trim="formItem.password" :type="passwordtype" placeholder="Password"></Input>
            <Checkbox v-model="showPassword" @on-change="handlePassword">Show Password</Checkbox>
        </FormItem>
        <FormItem>
            <Button v-if="formItem.id" type="primary" @click="handleEdit('formItem')">Update</Button>
            <Button v-else type="primary" :loading="loading" @click="handleSubmit('formItem')">Submit</Button>
            <Button type="ghost" style="margin-left: 8px" @click="handleCancel">Cancel</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import asconfigurationModel from '@/api/asconfiguration'

export default {
  name: 'addconfig',
  data () {
    const validateName = async(rule, value, callback) => {
      let res = await asconfigurationModel.get({
        userID: this.$store.state.user._id,
        name: value
      }).then(resp => {
        console.log('resp.data.data', resp.data.data)
        if (resp.data.data.length > 0) {
          return {status: true, valid: false}
        } else {
          return {status: true, valid: true}
        }
      }).catch(err => {
        console.log('Error', err)
        return {status: false, valid: false}
      })
      if (res.status) {
        if (!res.valid) {
          callback(new Error('! Name Already Exist, Please Enter another Name.'))
        } else {
          callback()
        }
      } else {
        callback(new Error('! Network Error'))
      }
    }
    return {
      isShow: false,
      showPassword: false,
      loading: false,
      passwordtype: 'password',
      formItem: {
        name: '',
        number: '',
        user: '',
        password: '',
        userID: this.$store.state.user._id,
        type: this.$route.params.type
      },
      rulesformItem: {
        name: [
          { required: true, message: '! Please Enter the Name', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        number: [
          { required: true, message: '! Please Enter the Number', trigger: 'blur' }
        ],
        user: [
          { required: true, message: '! Please Enter the User', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '! Please Enter the Password', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    getLabel () {
      return this.$route.params.type.toUpperCase() + ' Number'
    }
  },
  methods: {
    handlePassword (name) {
      if (name) {
        this.passwordtype = 'text'
      } else {
        this.passwordtype = 'password'
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          asconfigurationModel.post(this.formItem).then(res => {
            this.$Notice.success({title: 'Success', desc: 'Successfully saved.', duration: 3})
            this.$router.push('/settings')
          }).catch(err => {
            console.log('Error', err)
            this.loading = false
            this.$Notice.error({title: 'Error', desc: 'Not Saved.', duration: 3})
          })
        }
      })
    },
    handleCancel () {
      this.$router.push('/settings')
    },
    handleEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          asconfigurationModel.put(this.formItem.id, this.formItem).then(res => {
            this.$Notice.success({title: 'Success', desc: 'Successfully saved.', duration: 3})
            this.$router.push('/settings')
          }).catch(err => {
            console.log('Error', err)
            this.loading = false
            this.$Notice.error({title: 'Error', desc: 'Not Saved.', duration: 3})
          })
        }
      })
    }
  },
  mounted () {
    // this.$router.push('/uploader-joblist')
    console.log('this.$route.params.type', this.$route.params.type, this.$route.params.id)
    if (this.$route.params.type === 'asi' || this.$route.params.type === 'sage') {
      if (this.$route.params.id !== undefined) {
        asconfigurationModel.getThis(this.$route.params.id).then(res => {
          console.log('edit:', res)
          this.formItem = res.data
        }).catch(err => {
          console.log('Error:: ', err)
        })
      }
      this.isShow = true
    }
  }
}
</script>

<style scoped>
	.addconfig {
		padding: 40px;
	}
</style>
