import { createColor } from '@/server/colors.server'
import { useCrudForm } from '@/hooks/use-crud-form'
import { SimpleForm } from '@/components/forms/simple-form'

interface ColorFormData {
  name: string
  value: string
}

export function ColorForm() {
  const { formData, loading, updateField, handleSubmit } =
    useCrudForm<ColorFormData>({
      createFn: createColor,
      initialValues: { name: '', value: '' },
    })

  const fields = [
    {
      key: 'name',
      label: 'Color Name',
      placeholder: 'Input color name',
      required: true,
    },
    {
      key: 'value',
      label: 'Color Value',
      placeholder: 'Color Value (Hex)',
      type: 'color' as const,
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
      submitText={loading ? 'Creating...' : 'Create Color'}
    />
  )
}
