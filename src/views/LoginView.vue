<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios, { isAxiosError } from 'axios'
import { useVuelidate } from '@vuelidate/core'
import { useAuthStore } from '@/stores/auth'
import AppLoader from '@/components/AppLoader.vue'
import { required, minLength } from "@/utils/i18n-validators";

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const loading = ref(false)
const localError = ref<string[]>([])

const rules = computed(() => {
  return {
    username: { required },
    password: { required, minLength: minLength(6) },
  }
})

const v$ = useVuelidate(rules, { username, password })

const submitForm = async (): Promise<void> => {
  const result = await v$.value.$validate()
  if (result) {
    try {
      loading.value = true
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}auth`, {
        username: username.value,
        password: password.value,
      })
      if (response.status === 200) {
        authStore.setToken(response.data.token)
        console.log(response.data)
        router.push({ name: 'home' })
      }
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 400) {
        console.log(err.response.data)
        localError.value = err.response.data.error
      } else if (isAxiosError(err) && err.response?.status === 401) {
        console.log(err.response.data)
        localError.value = err.response.data.error
      } else {
        console.log(err)
      }
    } finally {
      loading.value = false
    }
  }
}
</script>

<template>
  <svg
    id="svg-source"
    height="0"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    style="position: absolute"
  >
    <g id="man-people-user" data-iconmelon="Streamline Icon Set:de32eb2621491c1a881a9fe846236da1">
      <g id="Expanded">
        <g>
          <g>
            <path
              d="M16.028,20c-4.764,0-8.639-4.486-8.639-10s3.875-10,8.639-10c4.763,0,8.638,4.486,8.638,10
				S20.791,20,16.028,20z M16.028,1.333C12,1.333,8.722,5.221,8.722,10s3.277,8.667,7.306,8.667c4.029,0,7.306-3.888,7.306-8.667
				S20.057,1.333,16.028,1.333z"
            ></path>
          </g>
          <g>
            <path
              d="M31.988,32H0.012v-4.515c0-1.967,1.245-3.733,3.097-4.395l8.224-2.266v-2.77h1.333v3.785L3.51,24.361
				c-1.275,0.458-2.165,1.72-2.165,3.124v3.182h29.309v-3.182c0-1.404-0.889-2.666-2.213-3.139l-9.107-2.506v-3.758h1.332v2.742
				l8.178,2.251c1.9,0.677,3.145,2.442,3.145,4.409V32z"
            ></path>
          </g>
          <g>
            <path
              d="M21.865,8.812c-0.045,0-0.09-0.001-0.137-0.003c-1.5-0.055-3.25-1.004-4.361-2.287
				C16.59,7.513,15.48,8.15,14.106,8.383c-2.403,0.413-5.152-0.51-5.988-1.321l0.928-0.957c0.403,0.391,2.69,1.329,4.836,0.964
				c1.332-0.226,2.292-0.911,2.854-2.034l0.558-1.114l0.617,1.082c0.738,1.292,2.508,2.425,3.867,2.475
				c0.604,0.016,1.033-0.165,1.307-0.571l1.105,0.745C23.686,8.403,22.863,8.812,21.865,8.812z"
            ></path>
          </g>
        </g>
      </g>
    </g>
    <g id="lock-locker" data-iconmelon="Streamline Icon Set:5d43c6f45cdbecfd5b8a12bc9e5dd33c">
      <g id="Expanded">
        <g>
          <g>
            <circle cx="16" cy="20" r="1.333"></circle>
          </g>
          <g>
            <path
              d="M16,25.333c-0.369,0-0.667-0.298-0.667-0.666v-4C15.333,20.298,15.631,20,16,20s0.667,0.298,0.667,0.667
				v4C16.667,25.035,16.369,25.333,16,25.333z"
            ></path>
          </g>
          <g>
            <path d="M28,32H4V12h24V32z M5.333,30.667h21.333V13.333H5.333V30.667z"></path>
          </g>
          <g>
            <path
              d="M24,12.667h-1.333V8c0-3.676-2.991-6.667-6.667-6.667c-3.676,0-6.667,2.99-6.667,6.667v4.667H8V8
				c0-4.412,3.588-8,8-8c4.411,0,8,3.588,8,8V12.667z"
            ></path>
          </g>
        </g>
      </g>
    </g>
  </svg>

  <div class="wrapper">
    <div class="header">
      <h3 class="sign-in">Авторизация</h3>
      <!--      <div class="button">-->
      <!--        Register-->
      <!--      </div>-->
    </div>
    <div class="clear"></div>
    <form action="#" @submit.prevent="submitForm" class="form">
      <div>
        <label class="user" for="text">
          <svg viewBox="0 0 32 32">
            <g filter="">
              <use xlink:href="#man-people-user"></use>
            </g>
          </svg>
        </label>
        <input
          class="user-input"
          v-model="username"
          type="text"
          name="login"
          id="login"
          placeholder="Login"
        />
        <div v-if="v$.username.$error" class="error">
          <small v-for="(error, i) in v$.username.$errors" :key="i">{{ error.$message }} </small>
        </div>
      </div>
      <div>
        <label class="lock" for="password">
          <svg viewBox="0 0 32 32">
            <g filter="">
              <use xlink:href="#lock-locker"></use>
            </g>
          </svg>
        </label>
        <input
          v-model="password"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
        />
        <div v-if="v$.password.$error" class="error">
          <small v-for="(error, i) in v$.password.$errors" :key="i">{{ error.$message }} </small>
        </div>
      </div>
      <div class="error" v-if="localError.length">
        <small>
          {{ localError }}
        </small>
      </div>
      <div class="form-footer">
        <AppLoader v-if="loading" />
        <input v-else type="submit" value="Sign in" />
      </div>

      <!--      <div class="radio-check">-->
      <!--        <input type="radio" class="radio-no" id="no" name="remember" value="no" checked>-->
      <!--        <label for="no"><i class="fa fa-times"></i></label>-->
      <!--        <input type="radio" class="radio-yes" id="yes" name="remember" value="yes">-->
      <!--        <label for="yes"><i class="fa fa-check"></i></label>-->
      <!--        <span class="switch-selection"></span>-->
      <!--      </div>-->
      <!--      <span class="check-label">Remember me</span>-->
      <!--      <span class="forgot-label">Lost your password?</span>-->
      <div class="clear"></div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 300px;
  margin: 12% auto;
}

form {
  position: relative;
}

.clear {
  clear: both;
}
.sign-in {
  float: left;
  color: white;
  font-size: 1.3em;
}
.button {
  float: right;
  color: #7f8084;
  border: 1px solid var(--border);
  padding: 7px 15px;
  border-radius: 3px;
  font-size: 0.8em;
  cursor: pointer;
}
.button:hover {
  color: #d3d3d3;
}
.lock {
  position: absolute;
  width: 30px;
  height: 30px;
  margin-top: 10px;
  padding: 7px;
  left: 5px;
  &::after {
    content: '';
    width: 1px;
    height: 30px;
    position: absolute;
    background: var(--border);
    top: 0px;
    left: 100%;
  }
}
.user {
  position: absolute;
  width: 30px;
  height: 30px;
  margin-top: 10px;
  padding: 7px;
  left: 5px;
  &::after {
    content: '';
    width: 1px;
    height: 30px;
    position: absolute;
    background: var(--border);
    top: 0px;
    left: 100%;
  }
}
.user svg,
.lock svg {
  fill: #757575
}


input {
  width: 100%;
  padding: 5px;
  height: 40px;
  border-radius: 3px;
  margin: 5px 0;
  outline: none;
  font-size: 16px;
}
input[type='text']:focus,
input[type='password']:focus {
  border: 1px solid var(--gold);
  box-shadow: none;
}
.user-input:focus .user {
  background: white !important;
}

input[type='text'] {
  background: transparent;
  border: 2px solid var(--border);
  padding-left: 45px;
  color: var(--gold);
}
input[type='password'] {
  background: transparent;
  border: 2px solid var(--border);
  padding-left: 45px;
  color: var(--gold);
}
input[type='submit'] {
  background: var(--gold);
  border: none;
  color: white;
  text-align: center;
  font-size: 0.8em;
  cursor: pointer;
  font-size: 16px;
}

input[type='radio'] {
  display: none;
}
.radio-check {
  width: 50px;
  height: 20px;
  border: 1px solid var(--border);
  border-radius: 30px;
  margin-top: 10px;
  float: left;
  text-align: center;
  padding: 4px 0;
  color: var(--gold);
  font-size: 0.65em;
  position: relative;
  label {
    margin: 0 2px;
    cursor: pointer;
  }
  .switch-selection {
    display: block;
    position: absolute;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #babbbd;
    margin-top: -11px;
    margin-left: 11px;
    transition: 0.2s ease-out;
  }
}

.radio-yes:checked ~ .switch-selection {
  margin-left: 25px !important;
}

.check-label {
  font-size: 0.8em;
  color: #7f8084;
  margin-top: 10px;
  float: left;
  padding: 3px 0;
  margin-left: 10px;
}

.forgot-label {
  font-size: 0.8em;
  color: #7f8084;
  margin-top: 10px;
  float: right;
  padding: 3px 0;
  cursor: pointer;
}
.error {
  color: red;
  padding: 5px 0;
}
.form-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
