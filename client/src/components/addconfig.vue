<template>
  <div class="addconfig" v-if="isShow">
    <h1 v-if="formItem.id">Edit {{this.$route.params.type.toUpperCase()}} Credential</h1>
    <h1 v-else>Add {{this.$route.params.type.toUpperCase()}} Credential</h1>
    <hr>
    <div style="margin-top:10px;border: 1px solid #C0C0C0;padding:20px">
      <Form :model="formItem" :label-width="300" ref="formItem" :rules="getRules">
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
import _ from 'lodash'
import config from '@/config'
import axios from 'axios'

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
    const editvalidateName = async(rule, value, callback) => {
      if (this.validName === value) {
        callback()
      } else {
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
      },
      updateRulesformItem: {
        name: [
          { required: true, message: '! Please Enter the Name', trigger: 'blur' },
          { validator: editvalidateName, trigger: 'blur' }
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
      },
      validName: ''
    }
  },
  computed: {
    getLabel () {
      return this.$route.params.type.toUpperCase() + ' Number'
    },
    getRules () {
      if (this.formItem.id !== undefined) {
        return this.updateRulesformItem
      } else {
        return this.rulesformItem
      }
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
    async handleSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          this.loading = true
          let isExist = await (this.checkExist(this.formItem))
          if (isExist) {
            let asiauth = await this.asiAuth(this.formItem)
            if (asiauth.valid) {
              await asconfigurationModel.post(this.formItem).then(res => {
                this.$Notice.success({title: 'Success', desc: 'Successfully saved.', duration: 3})
                this.$router.push('/settings')
              }).catch(err => {
                console.log('Error', err)
                this.loading = false
                this.$Notice.error({title: 'Error', desc: 'Not Saved.', duration: 3})
              })
            } else {
              this.loading = false
              this.$Notice.error({title: 'ASI Error', desc: 'Please Add Authorized Credential.', duration: 5})
            }
          }
        }
      })
    },
    async asiAuth (formItem) {
      let mdata = {
        asi: formItem.number,
        username: formItem.user,
        password: formItem.password
      }
      let res = await axios.post(config.asiUrl + 'Login', mdata).then(res => {
        console.log('res=>', res)
        return { valid: true }
      }).catch(err => {
        console.log('ASI Auth Error', err)
        return {valid: false, msg: err.message}
      })
      return res
    },
    async checkExist (formItem, value) {
      let res = await (asconfigurationModel.get({
        number: formItem.number,
        user: formItem.user,
        password: formItem.password,
        userID: formItem.userID
      }).then(async resp => {
        if (value !== undefined) {
          let finx = _.findIndex(resp.data.data, {id: formItem.id})
          if (finx !== -1) {
            resp.data.data.splice(finx, 1)
          }
        }
        if (resp.data.data.length > 0) {
          this.$Notice.warning({'title': 'Already exist with <b><i>' + resp.data.data[0].name + '</i></b>'})
          this.loading = false
          return false
        } else {
          return true
        }
      }).catch(e => {
        return false
      }))
      return res
    },
    handleCancel () {
      this.$router.push('/settings')
    },
    handleEdit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          this.loading = true
          let isExist = await (this.checkExist(this.formItem, 'edit'))
          if (isExist) {
            await asconfigurationModel.put(this.formItem.id, this.formItem).then(res => {
              this.$Notice.success({title: 'Success', desc: 'Successfully saved.', duration: 3})
              this.$router.push('/settings')
            }).catch(err => {
              console.log('Error', err)
              this.loading = false
              this.$Notice.error({title: 'Error', desc: 'Not Saved.', duration: 3})
            })
          }
        }
      })
    }
  },
  mounted () {
    // this.$router.push('/uploader-joblist')
    console.log('this.$route.params.type', this.$route.params.type, this.$route.params.id)
    if (this.$route.params.type === 'asi' || this.$route.params.type === 'sage') {
      if (this.$route.params.id !== undefined) {
        this.$Spin.show()
        asconfigurationModel.getThis(this.$route.params.id).then(res => {
          console.log('edit:', res)
          this.formItem = res.data
          this.validName = res.data.name
          this.$Spin.hide()
        }).catch(err => {
          this.$Spin.hide()
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
