<script setup lang="ts">
import { useSizeStore } from '@/stores'
import { computed } from 'vue'

const sizeStore = useSizeStore()

/* 尺寸变量配置相关 rounded */
const roundedOptions = computed(() => sizeStore.getRoundedOptions)
const rounded = computed(() => sizeStore.getRounded)

const setRounded = (value: RoundedOptions['key']) => {
  sizeStore.setRounded(value)
}
</script>
<template>
  <div class="between-start gap-gap">
    <span>棱角</span>
    <ButtonGroup>
      <template
        v-for="item in roundedOptions"
        :key="item.value"
      >
        <Button
          :label="item.label"
          :severity="rounded === item.key ? 'help' : 'secondary'"
          @click="setRounded(item.key)"
        />
      </template>
    </ButtonGroup>
  </div>
</template>
