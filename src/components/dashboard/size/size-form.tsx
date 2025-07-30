import { createSize } from '@/server/sizes.server'
import { useCrudForm } from '@/hooks/use-crud-form'
import { SimpleForm } from '@/components/forms/simple-form'

interface SizeFormData {
  name: string
  value: string
}

export function SizeForm() {
  const { formData, loading, updateField, handleSubmit } =
    useCrudForm<SizeFormData>({
      createFn: createSize,
      initialValues: { name: '', value: '' },
    })

  const fields = [
    {
      key: 'name',
      label: 'Size Name',
      placeholder: 'Input size name',
      required: true,
    },
    {
      key: 'value',
      label: 'Size Value',
      placeholder: 'Input size value (e.g., S, M, L)',
      required: true,
    },
  ]

  return (
    <SimpleForm
      fields={fields}
      formData={formData}
      onFieldChange={updateField}
      onSubmit={() => handleSubmit(['name', 'value'])}
      loading={loading}
      submitText={loading ? 'Creating...' : 'Create Size'}
    />
  )
}
