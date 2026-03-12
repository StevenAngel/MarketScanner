<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, LineChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent, GraphicComponent, GridComponent } from "echarts/components";
import VChart from "vue-echarts";
import { ref, computed, watch } from "vue";
import ChainSelector from "@/components/portfolio/ChainSelector.vue";
import { useAppKitAccount } from '@reown/appkit/vue'
const appKitAccount = useAppKitAccount({ "namespace": "eip155" })

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
const chartData = ref([])
const currentChain = ref('Ethereum')
const totalPortfolioValue = ref(0)
const isLoading = ref(true)

// COMPUTED
const isConnected = computed(() => appKitAccount.value.isConnected)
const address = computed(() => appKitAccount.value.address)
const subtext = computed(() => "Your assets on " + currentChain.value)
const totalValue = computed(() => 'Total\n$' + totalPortfolioValue.value)

use([CanvasRenderer, PieChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GraphicComponent, GridComponent]);

// PIECHART Options
const pieChartOptions = ref({
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

const lineChartOptions = ref({
    title: {
        text: "Portfolio Performance Last 365 Days",
        left: "center",
        textStyle: {
            color: "#ffffff",          // Ein sehr dunkles Grau (fast Schwarz) wirkt moderner als pures Schwarz
            fontSize: 24,              // Etwas größer
            fontWeight: 600,           // Schön fett (Bold)
            fontFamily: "Monaco, sans-serif", // Nutze eine moderne Sans-Serif
            lineHeight: 30
        },
    },
    tooltip: {
        trigger: 'axis',
        backgroundColor: '#1f2937',
        textStyle: { color: '#fff' },
        formatter: (params) => {
            const data = params[0];
            return `${data.name}<br/><b>$${data.value.toLocaleString()}</b>`;
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [1, 2, 3, 4],
        axisLine: { lineStyle: { color: '#444' } }
    },
    yAxis: {
        type: 'value',
        scale: true, // Startet nicht bei 0, besser für Krypto-Preise
        axisLabel: {
            formatter: (val) => `$${val}`
        },
        splitLine: { lineStyle: { color: '#222' } }
    },
    series: [
        {
            name: 'Price',
            type: 'line',
            smooth: true, // Macht die Kurve "smooth" statt zackig
            showSymbol: false,
            data: [1, 2, 3, 4],//props.historyData.map(d => d.price),
            lineStyle: {
                width: 3,
                color: '#6366f1' // Indigo
            },
            // Area Style für den coolen Glow-Effekt unter der Linie
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(99, 102, 241, 0.4)' },
                        { offset: 1, color: 'rgba(99, 102, 241, 0)' }
                    ]
                }
            }
        }
    ]
});

// Change chain on chainSelector click, fetches portfolio for new chain and changes ref values to load new charts
const changeChain = async (val) => {
    if (isConnected.value && address) {
        isLoading.value = true
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
    <div v-if="isConnected" class="chartConatiner">
        <div class="chainSelector">
            <!-- changeChain is emitted by child to pass data -->
            <ChainSelector @changeChain="changeChain" />
        </div>
        <div class="charts">

            <VChart class="chart" :option="pieChartOptions" :loading="isLoading" :loading-options="loadingOptions"
                autoresize />
            <VChart class="chart" :option="lineChartOptions" :loading="isLoading" :loading-options="loadingOptions"
                autoresize />

        </div>
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

.charts {
    width: 100%;
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