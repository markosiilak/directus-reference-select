<template>
  <v-select
    v-model="selectedItem"
    :items="items"
    item-value="value"
    item-text="text"
    :placeholder="placeholder"
    @update:model-value="(value) => emit('input', value)" />
</template>

<script setup lang="ts">
  import { useApi } from '@directus/extensions-sdk';
  import { onMounted, ref, watch } from 'vue';

  const props = defineProps<{
    targetCollection: string;
    placeholder?: string;
    value?: string;
  }>();

  const emit = defineEmits(['input']);
  const api = useApi();
  // Add an interface for the item structure
  interface SelectItem {
    text: string;
    value: string;
  }

  // Update the ref declaration with the type
  const items = ref<SelectItem[]>([]);
  const selectedItem = ref(props.value);

  watch(() => props.value, async (newValue) => {
    selectedItem.value = newValue;
    if (newValue) {
      await fetchCurrentItem(newValue);
    }
  });

  const fetchCurrentItem = async (id: string) => {
    try {
      const response = await api.get(`/items/${props.targetCollection}/${id}`, {
        params: {
          fields: ['id', 'translations.*'],
          deep: {
            translations: {
              _sort: ['languages_code']
            }
          }
        }
      });

      const currentItem = response.data.data;
      const displayText = currentItem.translations[0]?.name || currentItem.translations[0]?.title || 'Missing name or title';

      // Add current item to items list if not already present
      if (!items.value.some(item => item.value === id)) {
        items.value.push({
          text: displayText,
          value: id,
        });
      }
    } catch (error) {
      console.error('Error fetching current item:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await api.get(`/items/${props.targetCollection}?fields=translations.*,id`, {
        params: {
          fields: ['id', 'translations.*'],
          deep: {
            translations: {
              _sort: ['languages_code']
            }
          }
        }
      });
      items.value = response.data.data.map(item => {
        const displayText = item.translations[0]?.name || item.translations[0]?.title || 'Missing name or title';
        return {
          text: displayText,
          value: item.id,
        };
      });
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  onMounted(async () => {
    await fetchItems();
    if (props.value) {
      await fetchCurrentItem(props.value);
    }
  });
</script>
