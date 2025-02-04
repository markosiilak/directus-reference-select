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
  import { computed, onMounted, ref, watch } from 'vue';

  const props = defineProps<{
    targetCollection: string;
    placeholder?: string;
    value?: string;
  }>();

  const emit = defineEmits(['input']);
  const api = useApi();
  const items = ref([]);
  const selectedItem = ref(props.value);

  // Add this watch to keep selectedItem in sync with external value changes
  watch(() => props.value, (newValue) => {
    selectedItem.value = newValue;
  });

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

  onMounted(() => {
    fetchItems();
  });
</script>
