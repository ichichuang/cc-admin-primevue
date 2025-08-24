import MegaMenu from 'primevue/megamenu'
import type { MenuItem } from 'primevue/menuitem'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MegaMenu',
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
      <MegaMenu
        model={props.items}
        {...props.componentsProps}
      />
    )
  },
})
