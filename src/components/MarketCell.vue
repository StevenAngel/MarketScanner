<script setup>
import { ref, computed, watch } from 'vue'
const props = defineProps(['value', 'type', 'isLast'])
const colorClass = ref('normal')
let timeoutId = null

// Watch for props value changes
watch(() => props.value, (newValue, oldValue) => {
    colorClass.value = Number(newValue) > Number(oldValue) ? 'green' : 'red'

    // Reset timeout, no double timeout
    if (timeoutId) {
        clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
        colorClass.value = 'normal'
        timeoutId = null
    }, 5000)
})

// Formatting numbers consistently
const formatter = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10
})

// Format value
const formatted = computed(() => {
    switch (props.type) {
        case 'usd':
            return formatter.format(props.value) + '$'
        case 'percent':
            return formatter.format(props.value) + '%'
        case 'volume':
            return formatter.format(props.value)
        default:
            return props.value
    }
})
</script>

<template>
    <td :class="[props.isLast ? 'hr' : '', colorClass]">{{ formatted }}</td>
</template>

<style scoped>
.green {
    color: green;
    transition: color 0.2s;
}

.red {
    color: red;
    transition: color 0.2s;
}

.normal {
    color: black;
    transition: color 0.2s;
}
</style>