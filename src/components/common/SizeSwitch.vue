<script setup lang="ts">
import { t } from '@/locales'
import { useSizeStore } from '@/stores'
import { computed } from 'vue'

const sizeStore = useSizeStore()

const sizeOptions = computed(() => sizeStore.getSizeOptions)
const size = computed(() => sizeStore.getSize)

const setSize = (value: SizeOptions['value']) => {
  sizeStore.setSize(value)
}
</script>
<template lang="pug">
.between-start.gap-gap
  span {{ t('common.settings.size') }}
  ButtonGroup
    template(v-for='item in sizeOptions', :key='item.value')
      Button(
        :label='item.label',
        :severity='size === item.value ? "help" : "secondary"',
        @click='setSize(item.value)'
      )
</template>
