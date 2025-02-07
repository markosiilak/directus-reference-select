import { defineInterface } from '@directus/extensions-sdk';

import InterfaceComponent from "./interface.vue";
export default defineInterface({
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
        interface: "system-collection",
      },
    },
    {
      field: "value",
      name: "Value",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
      },
    },
    {
      field: "placeholder",
      name: "Placeholder",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
      },
    }
  ],
});
