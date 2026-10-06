# World Gym 全台價格查詢｜免費網站版

## 已完成
- 137 間分店
- 全省型／市區型／Express市區型／Express新竹市區型／單館
- 分店搜尋、地區篩選
- 12M／24M／36M 價格
- 停車與設備備註
- 手機版 UI
- 分享按鈕
- 可加入手機主畫面的 PWA 基礎設定
- 靜態唯讀網站：訪客不能在網站上修改資料

## 免費發布
GitHub Pages 可以用 GitHub Free 的 Public repository 發布靜態網站。
1. GitHub 建立 Public repository，例如 `worldgym-price`
2. 上傳本資料夾全部檔案
3. Settings → Pages
4. Source：Deploy from a branch
5. Branch：main / root
6. Save
7. 等待發布後取得 `https://你的帳號.github.io/worldgym-price/`

## 更新價格
把新的 Excel 放在本資料夾，執行：
`python convert_excel.py 你的Excel檔.xlsx`
會重新產生 `data.json`，再把新的 data.json 上傳到 GitHub。

注意：GitHub Pages 是公開網站，不要放會員個資、密碼或其他機密資料。實際價格與方案以公司最新公告為準。
