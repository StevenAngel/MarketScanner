<script setup>
import CustomButton from '../layout/CustomButton.vue';
import { useAppKit, useAppKitAccount } from '@reown/appkit/vue'
const modal = useAppKit();
const appKitAccount = useAppKitAccount({ "namespace": "eip155" })
const isConnected = computed(() => appKitAccount.value.isConnected)
const address = computed(() => appKitAccount.value.address)
const buttonText = ref('Connect Wallet')
watch(isConnected, (newValue, oldValue) => {
    if (newValue == true) {
        buttonText.value = address
    } else {
        buttonText.value = "Connect Wallet"
    }
})


const connectWallet = () => {
    if (!isConnected) {
        modal.open()
    }
}
</script>

<template>
    <CustomButton :text="buttonText" @click="connectWallet()" />
</template>

<style scoped></style>