<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

import HomeIcon from "@/components/icons/HomeIcon.vue";
import LogsIcon from "@/components/icons/LogsIcon.vue";
import BackupIcon from "@/components/icons/BackupIcon.vue";
import UserIcon from "@/components/icons/UserIcon.vue";
import ReportIcon from "@/components/icons/ReportIcon.vue";
import ReferenceIcon from "@/components/icons/ReferenceIcon.vue";
import SettingsIcon from "@/components/icons/SettingsIcon.vue";

interface Nav{
  title:string,
  route:string,
  icon: unknown
}
const navs:Nav[] = [
  {
    title:"Главная",
    route:"/",
    icon:HomeIcon
  },
  {
    title:"Логи",
    route:"/logs",
    icon:LogsIcon
  },
  {
    title:"Бэкапы",
    route:"/backups",
    icon:BackupIcon
  },
  {
    title:"Юзеры",
    route:"/users",
    icon:UserIcon
  },
  {
    title:"Справка",
    route:"/reference",
    icon:ReferenceIcon
  },
  {
    title:"Отчеты",
    route:"/reports",
    icon:ReportIcon
  },
  {
    title:"Настройки",
    route:"/settings",
    icon:SettingsIcon
  }
]
const isOpen = ref(false)
const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <nav class="navbar">
    <button class="navbar-button" @click="toggle">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="30px" height="30px">
        <path d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 Z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 Z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 Z"/>
      </svg>
    </button>
    <button class="navbar-button" v-show="isOpen" @click="toggle">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="36px" height="36px">
        <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"/>
      </svg>
    </button>
    <ul class="navbar-list" :class="{ 'navbar-list--open': isOpen, 'navbar-list--close': !isOpen }">
      <li v-for="nav in navs" :key="nav.title" class="navbar-item">
        <router-link :to="nav.route" class="navbar-link">
          <div class="navbar-icon">
            <component :is="nav.icon" />
          </div>
          {{ nav.title }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>


<style scoped lang="scss">
.navbar {
  &-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 22px;
    margin: 0;
    margin-block-start: 0;
    margin-block-end: 0;
    list-style: none;
    padding-inline-start: 0;
    transition: transform 0.3s ease-in-out;

    @media screen and (max-width: 768px) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      flex-direction: column;
      align-items: flex-start;
      padding: 20px;
      background-color: var(--blue);
      transform: translateX(-100%);
    }
  }

  &-list--open {
    @media screen and (max-width: 768px) {
      transform: translateX(0);
    }
  }

  &-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-size: 13px;
    line-height: 14px;
    text-decoration: none;
    gap: 5px;
    transition: opacity 0.3s;

    &.router-link-active {
      color: var(--yellow);
    }

    &:hover {
      opacity: 0.8;
    }

    @media screen and (max-width: 768px) {
      flex-direction: row;
      gap: 10px;
    }
  }

  &-icon {
    width: 92px;
    height: 70px;
    border-radius: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--yellow);

    & svg {
      @media screen and (max-width: 768px) {
        width: 30px;
        height: 30px;
      }
    }

    @media screen and (max-width: 768px) {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

  &-button {
    display: none;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background-color: var(--yellow);
    border: none;
    border-radius: 32px;
    align-items: center;
    justify-content: center;
    z-index: 5;

    @media screen and (max-width: 768px) {
      display: flex;
    }

    & svg {
      width: 30px;
      height: 30px;
    }
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@media screen and (max-width: 768px) {
  .navbar-list--open {
    animation: slideIn 0.3s forwards;
  }

  .navbar-list--close {
    animation: slideOut 0.3s forwards;
  }
}

</style>

