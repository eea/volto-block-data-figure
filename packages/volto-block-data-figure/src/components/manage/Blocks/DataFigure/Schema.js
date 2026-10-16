const Schema = {
  title: 'Data figure settings',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'placeholder',
        'instructions',
        'disabledMessage',
        'required',
        'fixed',
        'disableNewBlocks',
        'readOnly',
      ],
    },
  ],
  properties: {
    placeholder: {
      title: 'Helper text',
      description:
        'A short hint that describes the expected value within this block',
      type: 'string',
    },
    instructions: {
      title: 'Instructions',
      description: 'Detailed expected value within this block',
      type: 'string',
      widget: 'richtext',
    },
    disabledMessage: {
      title: 'Disabled message',
      description: "e.g.: Can't upload image while adding. Please save first.",
      type: 'string',
    },
    required: {
      title: 'Required',
      description: "Don't allow deletion of this block",
      type: 'boolean',
    },
    fixed: {
      title: 'Fixed position',
      description: 'Disable drag & drop on this block',
      type: 'boolean',
    },
    disableNewBlocks: {
      title: 'Disable new blocks',
      description: 'Disable creation of new blocks after this block',
      type: 'boolean',
    },
    readOnly: {
      title: 'Read-only',
      description: 'Disable editing on this block',
      type: 'boolean',
    },
  },
  required: [],
};

export default Schema;
