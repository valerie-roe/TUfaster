<template>
    <div class="@container-size max-sm:hidden flex size-full justify-center items-center gap-4 ">
        <img :src="icon" class="max-h-1/2">
        <button class="btn @max-lg:hidden! shrink-0" @click="openAll">{{ t("content.opal.openAllCourses")
            }}</button>
        <button class="btn shrink-0" @click="openFavorites">{{ t("content.opal.openAllFavorites")
            }}</button>
        <button class="btn @max-xs:hidden! shrink-0" @click="closeAll">{{ t("content.opal.closeAllTabs") }}</button>
    </div>
</template>

<script setup lang="ts">
import icon from "@/assets/icons/rockets/default_128px.png"

const parent = inject("uiContainer") as HTMLElement
parent.style.overflow = "hidden"
parent.style.flexGrow = "1"
// parent.style.minWidth = "0"


// TODO make functionality work with new course storage schema
const openAll = () => browser.runtime.sendMessage({
    cmd: 'open_all',
    links: 'meine_kurse',
    behavior: 'immediate_active'
})
const openFavorites = () => browser.runtime.sendMessage({
    cmd: 'open_all',
    links: 'favoriten',
    behavior: 'immediate_active'
})

const closeButtons = useQAll<HTMLButtonElement>(".btn-close")
async function closeAll() {
    const toClose = closeButtons.value.length
    let closed = 0
    for (closed = 1; closed <= toClose; closed++) {
        console.log(closed, toClose, qMust<HTMLButtonElement>(".btn-close"))
        qMust<HTMLButtonElement>(".btn-close").click()
        await delay(100)
    }

    browser.runtime.sendMessage({
        cmd: 'close_all_tabs',
        closedCount: closed
    })
}

</script>

<style scoped></style>