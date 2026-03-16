<script setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
    // Which attribute should be changed
    selector: 'html',
    attribute: 'class',
    // Class for darkmode (:root)
    valueDark: '',
    // Class for lightmode (html.light)
    valueLight: 'light',
    // Standard is darkmode
    initialValue: 'dark',
})
const toggleDark = useToggle(isDark)
</script>

<template>
    <button @click="toggleDark()">
        {{ isDark ? 'Light-Mode' : 'Dark-Mode' }}
    </button>
</template>