import type { MenuItem } from 'primevue/menuitem'
import PanelMenu from 'primevue/panelmenu'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PanelMenu',
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
      <PanelMenu
        model={props.items}
        {...props.componentsProps}
      />
    )
  },
})
