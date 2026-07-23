import { computed } from 'vue'

// 商品分類顏色對應表
export function useCategory() {
  // 設定分類顏色對應表
  const colorMap = {
    綠茶: 'green-darken-3',
    白茶: 'blue-grey-darken-1',
    黃茶: 'orange-darken-1',
    '青茶(烏龍茶)': 'teal-darken-2',
    紅茶: 'red-darken-4',
    '黑茶(普洱茶)': 'brown-darken-4',
  }

  // 取得分類對應的顏色
  const getCategoryColor = (category) => {
    return colorMap[category] || 'brown-darken-3'
  }

  // 計算所有分類的顏色對應表
  const categoryColors = computed(() => colorMap)

  return {
    colorMap,
    getCategoryColor,
    categoryColors,
  }
}
