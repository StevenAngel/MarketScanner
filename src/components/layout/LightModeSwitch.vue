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
    <button class="toggleSwitch" @click="toggleDark()">
        <div class="innerToggle" :class="isDark ? '' : 'light'">
            <span class=" icon">{{ isDark ? '🌙' : '☀️' }}</span>

        </div>
    </button>
</template>

<style scoped>
.toggleSwitch {
    width: 56px;
    height: 30px;
    border-radius: 999px;
    cursor: pointer;
    position: relative;
    background-color: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    padding: 0 2px;
}

.innerToggle.light {
    translate: 24px 0px;
}

.innerToggle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--bg-main);
    border: 1px solid var(--border-subtle);
    align-items: center;
    justify-content: center;
    display: flex;
    line-height: 1;
    translate: 0px 0px;
    /* !important, because useDark overrides every animation */
    transition:
        translate 0.3s cubic-bezier(0.3, 0.8, 0.3, 1.2),
        background-color 0.3s linear !important;
}

.icon {
    font-size: 14px;
}
</style>