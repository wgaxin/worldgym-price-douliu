import json,re,sys;from pathlib import Path;import openpyxl
GENERIC_MAP={"全省型":"全省型","市區型":"市區型","Express型":"Express市區型","新竹Express型":"Express新竹市區型"}
src=Path(sys.argv[1] if len(sys.argv)>1 else "各點價格20260128更新.xlsx");ws=openpyxl.load_workbook(src,data_only=True)["各點價格"];generic={};current=None
for r in range(1,38):
 b=ws.cell(r,2).value;c=ws.cell(r,3).value
 if b in GENERIC_MAP and c=="12M":current=GENERIC_MAP[b];generic[current]=[]
 elif current and b and isinstance(c,(int,float)):generic[current].append({"plan":str(b).strip(),"12M":{"fee":ws.cell(r,3).value,"monthly":ws.cell(r,4).value},"24M":{"fee":ws.cell(r,5).value,"monthly":ws.cell(r,6).value},"36M":{"fee":ws.cell(r,7).value,"monthly":ws.cell(r,8).value}})
region=str(ws.cell(39,2).value).strip();branches=[]
for r in range(40,ws.max_row+1):
 b=ws.cell(r,2).value;c=ws.cell(r,3).value
 if b and c is None:region=str(b).strip()
 elif b and isinstance(c,(int,float)):
  name=str(b).strip();m=re.match(r"^(\d+)\s*-\s*(.*)$",name);code=m.group(1) if m else "";clean=m.group(2).strip() if m else name
  branches.append({"id":f"r{r}","code":code,"name":clean,"displayName":name,"region":region,"12M":{"fee":c,"monthly":ws.cell(r,4).value},"24M":{"fee":ws.cell(r,5).value,"monthly":ws.cell(r,6).value},"36M":{"fee":ws.cell(r,7).value,"monthly":ws.cell(r,8).value},"parking":str(ws.cell(r,9).value).strip() if ws.cell(r,9).value else "","equipment":str(ws.cell(r,10).value).strip() if ws.cell(r,10).value else ""})
out={"meta":{"title":"World Gym 全台價格查詢","subtitle":"分店價格・設備・停車資訊","source":src.name,"updated":"請依檔名或資料內容修改","branchCount":len(branches),"note":"實際方案與價格以公司最新公告為準。"},"categoryOrder":["全省型","市區型","Express市區型","Express新竹市區型","單館"],"genericPlans":generic,"branches":branches};Path("data.json").write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding="utf-8");print(f"已產生 data.json：{len(branches)} 間分店")
