# World Gym 全台價格查詢｜Google Sheets 管理版

網站仍可放在 GitHub Pages，但資料改由 Google Sheets 提供。

## ✅ 已完成 Google Sheets 串接

`config.js` 已填入「分店」與「價格」CSV 網址，可直接部署到 GitHub Pages。

## 你日常只要改 Google Sheets
1. 「分店」：分店名稱、地區、停車、設備。
2. 「價格」：全省型／市區型／Express／單館的手續費與月費。
3. Google Sheets：檔案 → 共用 → 發布到網路。
4. 分別發布「分店」與「價格」兩個工作表，格式選 CSV。
5. 把兩個 CSV 網址貼到 `config.js`：
   - `branchesCsv`
   - `pricesCsv`
6. 把 `config.js` 上傳到 GitHub，網站就會從 Google Sheets 讀取。

## 第一次設定
先把 `WorldGym_GoogleSheets_管理版.xlsx` 匯入 Google Sheets。
完成兩個 CSV 發布網址後，再修改 `config.js`。

## 安全提醒
Google 官方說明指出，發布到網路的內容可供網路上的人查看，因此不要把機密或內部敏感資訊放在被發布的工作表。

## 備援
即使 Google Sheets 設定尚未完成，網站仍會退回使用 `data.json` 的原始資料。
