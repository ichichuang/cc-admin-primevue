import Menu from 'primevue/menu'
import type { MenuItem } from 'primevue/menuitem'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CustomMenu',
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
      <Menu
        model={props.items}
        {...props.componentsProps}
      />
    )
  },
})
