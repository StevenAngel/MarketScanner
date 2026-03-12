<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent, GraphicComponent } from "echarts/components";
import VChart from "vue-echarts";
import { ref, computed, watch } from "vue";
import ChainSelector from "@/components/portfolio/ChainSelector.vue";
import { useAppKitAccount } from '@reown/appkit/vue'
const appKitAccount = useAppKitAccount({ "namespace": "eip155" })
const chartData = ref([])
const currentChain = ref('Ethereum')
const totalPortfolioValue = ref(0)
const isConnected = computed(() => appKitAccount.value.isConnected)
const address = computed(() => appKitAccount.value.address)
const subtext = computed(() => "Your assets on " + currentChain.value)
const totalValue = computed(() => 'Total\n$' + totalPortfolioValue.value)
use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent, GraphicComponent]);

const option = ref({
    title: {
        text: "Portfolio",
        subtext: subtext,
        left: "center",
        textStyle: {
            color: "#ffffff",          // Ein sehr dunkles Grau (fast Schwarz) wirkt moderner als pures Schwarz
            fontSize: 24,              // Etwas größer
            fontWeight: 600,           // Schön fett (Bold)
            fontFamily: "Monaco, sans-serif", // Nutze eine moderne Sans-Serif
            lineHeight: 30
        },

        // Styling für den Untertitel
        subtextStyle: {
            color: "#6b7280",          // Ein dezentes Grau (Slate-Gray)
            fontSize: 14,
            fontWeight: 400,
            fontFamily: "Monaco, sans-serif",
        },
    },
    tooltip: { trigger: 'item', backgroundColor: 'rgba(255, 255, 255, 0.9)', },
    series: [
        {
            type: 'pie',
            radius: ['40%', '70%'], // Erzeugt den modernen Ring-Look
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10, // Abgerundete Ecken für den modernen Look
                borderColor: '#fff',
                borderWidth: 2,
            },
            label: {
                show: true,
                fontSize: '18',
                color: 'rgba(255, 255, 255, 1)'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '18',
                    fontWeight: 'bold',
                    formatter: '{b}\n{d}%' // Zeigt Name & Prozent in der Mitte an
                },
                itemStyle: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.2)'
                }
            },
            data: chartData
        },
    ],
    graphic: [
        {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
                text: totalValue,
                textAlign: 'center',
                fill: '#fff',
                fontSize: 20,
                fontWeight: 'bold'
            }
        }
    ]
});

const changeChain = async (val) => {
    if (isConnected.value && address) {
        const walletData = await fetch("http://localhost:3000/portfolio", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Das hier fehlt wahrscheinlich!
                'Accept': 'application/json'
            },
            body: JSON.stringify({ wallet: address.value, chain: val.id })
        }).then(res => res.json())
        // { symbol: element.symbol, logo: element.logo, balance: element.balance_formatted, usdValue: element.usd_value, usdPrice: element.usd_price, portfolioPercent: element.portfolio_percentage }
        const data = []
        let portfolioValue = 0
        walletData.forEach(element => {
            portfolioValue += element.usdValue
            data.push({ value: element.usdValue, name: element.symbol })
        })
        totalPortfolioValue.value = portfolioValue.toFixed(2)
        chartData.value = data
        currentChain.value = val.name
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
    <div v-if="isConnected" class="chartConatiner">
        <div class="chainSelector">
            <!-- changeChain is emitted by child to pass data -->
            <ChainSelector @changeChain="changeChain" />
        </div>
        <VChart class="chart" :option="option" autoresize />
    </div>
    <div v-else>
        <h1 class="connectMessage">Please Connect Your Wallet to View Your Portfolio</h1>
    </div>
</template>

<style scoped>
.chartConatiner {
    width: 100%;
    height: 50rem;
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