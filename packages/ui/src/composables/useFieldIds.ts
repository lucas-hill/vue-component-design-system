import { computed, useId } from 'vue'

export function useFieldIds(props: { error?: string; description?: string }) {
  const id = useId()
  const inputId = `field-${id}`
  const labelId = `field-label-${id}`
  const errorId = `field-error-${id}`
  const descriptionId = `field-desc-${id}`

  const ariaDescribedBy = computed(() => {
    const ids: string[] = []
    if (props.error) ids.push(errorId)
    if (props.description) ids.push(descriptionId)
    return ids.length ? ids.join(' ') : undefined
  })

  const ariaInvalid = computed(() => (props.error ? true : undefined))

  return { inputId, labelId, errorId, descriptionId, ariaDescribedBy, ariaInvalid }
}
