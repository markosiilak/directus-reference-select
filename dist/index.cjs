import { useApi, defineInterface } from '@directus/extensions-sdk';
import { defineComponent, ref, watch, onMounted, resolveComponent, openBlock, createBlock } from 'vue';

var _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "interface",
  props: {
    targetCollection: {},
    placeholder: {},
    value: {}
  },
  emits: ["input"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const api = useApi();
    const items = ref([]);
    const selectedItem = ref(props.value);
    watch(() => props.value, async (newValue) => {
      selectedItem.value = newValue;
      if (newValue) {
        await fetchCurrentItem(newValue);
      }
    });
    const fetchCurrentItem = async (id) => {
      var _a, _b;
      try {
        const response = await api.get(`/items/${props.targetCollection}/${id}`, {
          params: {
            fields: ["id", "translations.*"],
            deep: {
              translations: {
                _sort: ["languages_code"]
              }
            }
          }
        });
        const currentItem = response.data.data;
        const displayText = ((_a = currentItem.translations[0]) == null ? void 0 : _a.name) || ((_b = currentItem.translations[0]) == null ? void 0 : _b.title) || "Missing name or title";
        if (!items.value.some((item) => item.value === id)) {
          items.value.push({
            text: displayText,
            value: id
          });
        }
      } catch (error) {
        console.error("Error fetching current item:", error);
      }
    };
    const fetchItems = async () => {
      try {
        const response = await api.get(`/items/${props.targetCollection}?fields=translations.*,id`, {
          params: {
            fields: ["id", "translations.*"],
            deep: {
              translations: {
                _sort: ["languages_code"]
              }
            }
          }
        });
        items.value = response.data.data.map((item) => {
          var _a, _b;
          const displayText = ((_a = item.translations[0]) == null ? void 0 : _a.name) || ((_b = item.translations[0]) == null ? void 0 : _b.title) || "Missing name or title";
          return {
            text: displayText,
            value: item.id
          };
        });
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    onMounted(async () => {
      await fetchItems();
      if (props.value) {
        await fetchCurrentItem(props.value);
      }
    });
    return (_ctx, _cache) => {
      const _component_v_select = resolveComponent("v-select");
      return openBlock(), createBlock(_component_v_select, {
        modelValue: selectedItem.value,
        "onUpdate:modelValue": [
          _cache[0] || (_cache[0] = ($event) => selectedItem.value = $event),
          _cache[1] || (_cache[1] = (value) => emit("input", value))
        ],
        items: items.value,
        "item-value": "value",
        "item-text": "text",
        placeholder: _ctx.placeholder
      }, null, 8, ["modelValue", "items", "placeholder"]);
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
  icon: "pages",
  description: "Select items from other collections as references",
  component: InterfaceComponent,
  types: ["string"],
  group: "relational",
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
      field: "value",
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
