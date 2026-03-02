export { default as IconHome } from './IconHome.vue'
export { default as IconSave } from './IconSave.vue'
export { default as IconTrash } from './IconTrash.vue'

/**
 * Union of all registered icon names. Extend this as new icons are added
 * to the icons directory and registered in Icon.vue.
 */
export type IconName = 'home' | 'save' | 'trash'
