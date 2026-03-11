<script setup>
import { ref, computed, watch } from 'vue';
import CustomButton from '../layout/CustomButton.vue';
// useAppKit to use the modal, useAppKitAccount to check connection
import { useAppKit, useAppKitAccount } from '@reown/appkit/vue'
const modal = useAppKit();
const appKitAccount = useAppKitAccount({ "namespace": "eip155" })
const isConnected = computed(() => appKitAccount.value.isConnected)
const address = computed(() => appKitAccount.value.address)
const buttonText = ref('Connect Wallet')
watch(isConnected, (newValue, oldValue) => {
    if (newValue == true && address) {
        buttonText.value = address.value.slice(0, 10) + "..."
    } else {
        buttonText.value = "Connect Wallet"
    }
})

/**
 * Opening the modal can connect to the wallet, if not connected yet
 * If connected: Change network/wallet, send crypto, disconnect
 */
const openModal = () => {
    modal.open()
}
</script>

<template>
    <CustomButton :text="buttonText" @click="openModal()" />
</template>

<style scoped></style>