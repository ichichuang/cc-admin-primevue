import type { MenuItem } from 'primevue/menuitem'
import TieredMenu from 'primevue/tieredmenu'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TieredMenu',
  props: {
    type: {
      type: String,
      required: true,
    },
    items: {
      type: Array as () => MenuItem[],
      default: () => [],
    },
    componentsProps: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => (
      <TieredMenu
        model={props.items}
        {...props.componentsProps}
      />
    )
  },
})
