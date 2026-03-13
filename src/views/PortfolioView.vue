<script setup>
import { useAppKitAccount } from '@reown/appkit/vue'
import { ref, computed, watch } from "vue"
import PieChart from "@/components/charts/PieChart.vue"
import LineChart from "@/components/charts/LineChart.vue"
import ChainSelector from "@/components/portfolio/ChainSelector.vue"
const appKitAccount = useAppKitAccount({ "namespace": "eip155" })

// Chart loading style
const loadingOptions = {
    text: 'Loading...',
    color: '#6366f1',
    textColor: '#fff',
    fontSize: 24,
    fontWeight: 600,
    maskColor: 'rgba(0, 0, 0, 0.8)',
    zlevel: 0
};

// REFs
const pieChartData = ref([])
const lineChartDataY = ref([])
const lineChartDataX = ref([])
const currentChain = ref('Ethereum')
const totalPortfolioValue = ref(0)
const isLoading = ref(true)

// COMPUTED
const isConnected = computed(() => appKitAccount.value.isConnected)
const address = computed(() => appKitAccount.value.address)
const subtext = computed(() => "Your assets on " + currentChain.value)
const totalValue = computed(() => 'Total\n$' + totalPortfolioValue.value)

// Change chain on chainSelector click, fetches portfolio for new chain and changes ref values to load new charts
const changeChain = async (val) => {
    if (isConnected.value && address) {
        console.log(isConnected.value, address.value)

        isLoading.value = true
        const walletData = await fetch("http://localhost:3000/portfolio", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Das hier fehlt wahrscheinlich!
                'Accept': 'application/json'
            },
            body: JSON.stringify({ wallet: address.value, chain: val.id })
        }).then(res => res.json())
        console.log(walletData)

        const data = []
        let portfolioValue = 0

        // Set portfolio value and chartdata
        walletData.portfolio.forEach(element => {
            portfolioValue += element.usdValue
            data.push({ value: element.usdValue, name: element.symbol })
        })

        // Clear lineChart data
        lineChartDataX.value = []
        lineChartDataY.value = []
        // Set portfolio history
        walletData.portfolioHistory.forEach(element => {
            lineChartDataX.value.push(element.timestamp)
            lineChartDataY.value.push(element.price)
        })

        totalPortfolioValue.value = portfolioValue.toFixed(2)
        pieChartData.value = data
        currentChain.value = val.name
        isLoading.value = false
    }
}

// Load eth assets on wallet connected
watch(address, (newVal,) => {
    if (newVal) {
        changeChain({ address: newVal, id: 'eth', name: 'Ethereum' })
    }
})
</script>

<template>
    <div v-if="isConnected">
        <div class="chainSelector">
            <!-- changeChain is emitted by child to pass data -->
            <ChainSelector @changeChain="changeChain" />
        </div>
        <div class="charts">
            <PieChart class="chart" :chartData="pieChartData" :chartSubtext="subtext" :chartTotalValue="totalValue"
                :isLoading="isLoading" :loadingOptions="loadingOptions" />
            <LineChart class="chart" :lineChartDataX="lineChartDataX" :lineChartDataY="lineChartDataY"
                :loading="isLoading" :loading-options="loadingOptions" />

        </div>
    </div>
    <div v-else>
        <h1 class="connectMessage">Please Connect Your Wallet to View Your Portfolio</h1>
    </div>
</template>

<style scoped>
.charts {
    width: 99%;
    height: 50rem;
    display: flex;
}

.chainSelector {
    position: relative;
    margin: 1rem;
}

.chart {
    height: 100%;
}

.connectMessage {
    margin: 1rem;
    text-align: center;
}
</style>