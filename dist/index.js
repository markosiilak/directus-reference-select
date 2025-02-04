import { useApi, defineInterface } from '@directus/extensions-sdk';
import { defineComponent, ref, onMounted, resolveComponent, openBlock, createBlock } from 'vue';

var _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "interface",
  props: {
    targetCollection: {},
    displayField: {},
    placeholder: {},
    value: {}
  },
  emits: ["input"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const api = useApi();
    const items = ref([]);
    const selectedItem = ref(() => props.value || null);
    const fetchItems = async () => {
      try {
        const response = await api.get(`/items/${props.targetCollection}`);
        items.value = response.data.data;
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    const emitValue = (value) => {
      emit("input", value);
    };
    onMounted(() => {
      fetchItems();
    });
    return (_ctx, _cache) => {
      const _component_v_select = resolveComponent("v-select");
      return openBlock(), createBlock(_component_v_select, {
        modelValue: selectedItem.value,
        "onUpdate:modelValue": [
          _cache[0] || (_cache[0] = ($event) => selectedItem.value = $event),
          emitValue
        ],
        items: items.value,
        "item-value": "id",
        "item-text": _ctx.displayField,
        placeholder: _ctx.placeholder
      }, null, 8, ["modelValue", "items", "item-text", "placeholder"]);
    };
  }
});

var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

var InterfaceComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "interface.vue"]]);

var index = defineInterface({
  id: "reference-selector",
  name: "Reference Selector",
  icon: "link",
  description: "Select items from other collections as references",
  component: InterfaceComponent,
  group: "relational",
  types: ["string"],
  options: [
    {
      field: "targetCollection",
      name: "Target Collection",
      type: "string",
      meta: {
        width: "half",
        interface: "system-collection"
      }
    },
    {
      field: "displayField",
      name: "Display Field",
      type: "string",
      meta: {
        width: "half",
        interface: "system-field",
        options: {
          collectionField: "targetCollection"
        }
      }
    },
    {
      field: "placeholder",
      name: "Placeholder",
      type: "string",
      meta: {
        width: "full",
        interface: "input"
      }
    }
  ]
});

export { index as default };
