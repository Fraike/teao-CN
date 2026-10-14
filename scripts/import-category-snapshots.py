"""Build local category read models from saved public HTML; never writes the database."""
from pathlib import Path
from urllib.parse import urljoin
import re, json, html, subprocess, hashlib
ROOT=Path('docs/site-audit/2026-09-10')
ORIGIN='https://www.chinateao.com/'
CONFIG=[
 ('gear-damper','齿轮阻尼器','/gear-damper/','docs/site-audit/2026-09-09/snapshots/gear-damper.html',3,'齿轮阻尼器通过齿轮机构与阻尼油配合，控制机构开启、关闭的速度，减少闭合冲击与噪音。应用于汽车内饰、家用电器和工业机械，可在标准扭矩范围内定制。'),
 ('axial-damper','圆筒阻尼器','/axial-dampers/',str(ROOT/'snapshots/axial-dampers.html'),2,'圆筒阻尼器通过硅油黏度与阻尼结构控制旋转动作，适用于安全把手、汽车门把手、中控扶手、衣帽钩等部件，也可用于家电与其他机构。'),
 ('glove-box-damper','手套箱阻尼器','/Glove Box Dampers/',str(ROOT/'snapshots/glove-box-dampers.html'),2,'手套箱阻尼器为开启过程提供缓冲阻力，使手套箱平稳、缓慢开启。适用于不同类型和尺寸的汽车手套箱，选型时需结合安装结构与运动行程。'),
 ('latch','锁扣','/latches/',str(ROOT/'snapshots/latches.html'),1,'锁扣用于盖板及翻盖机构的锁定与解锁，结构小巧，便于安装。可用于汽车眼镜盒、杯架、储物盒、充电接口及家用电器等场景。'),
 ('other','其他零部件','/qitaqichelingbujian/',str(ROOT/'snapshots/other.html'),1,'配合阻尼器、锁扣使用的功能性零部件，用于缓冲、平稳启闭和定位等机构。产品覆盖汽车、家电及工业设备应用，支持结合具体结构评估。'),
]
assets={a['source']:a for a in json.loads(Path('docs/site-audit/2026-09-09/assets.json').read_text())}
newassets=[]
def asset(source):
 source=urljoin(ORIGIN,source)
 if source in assets:return assets[source]['local']
 filename=hashlib.sha256(source.encode()).hexdigest()[:10]+'-'+source.rsplit('/',1)[1]
 path=Path('public/images/live-site')/filename
 if not path.exists():
  result=subprocess.run(['curl','-sS','--max-time','20','-o',str(path),'-w','%{http_code}',source],capture_output=True,text=True)
  if result.stdout!='200':
   path.unlink(missing_ok=True);raise RuntimeError(f'Asset failed: {source}: {result.stdout}')
 record={'source':source,'local':'/images/live-site/'+filename,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
 assets[source]=record;newassets.append(record);return record['local']
def text(value):return html.unescape(re.sub('<[^>]+>','',value)).strip()
def parse_cards(s):
 body=s.split('<div class="products standardLink">')[1].split('<div class="pager">')[0]
 result=[]
 for block in body.split('<div class="item">')[1:]:
  a=re.search(r'<a href="([^"]+)"[^>]*class="image"',block)
  image=re.search(r'data-original="([^"]+)"',block)
  title=re.search(r'class="name"[^>]*>(.*?)</a>',block,re.S)
  if not (a and image and title):continue
  title=text(title[1]); models=list(dict.fromkeys(re.findall(r'RD-\s*[TV]?\d+[A-Z]?',title,re.I)))
  result.append({'path':'/'+html.unescape(a[1]).lstrip('/'),'title':title,'model':' / '.join(models) or title,'imageSource':urljoin(ORIGIN,image[1]),'image':asset(image[1]),'specifications':[text(v) for v in re.findall(r'class="size"[^>]*>(.*?)</a>',block,re.S)]})
 return result
catalog=[]
for ident,label,path,first,count,description in CONFIG:
 s=Path(first).read_text();hero=s.split('<div class="productShow">')[1]
 heroSrc=re.search(r'data-original="([^"]+)"',hero)[1]
 pages=[]
 for number in range(1,count+1):
  snapshot=Path(first) if number==1 else ROOT/'snapshots'/f'{Path(first).stem}-{number}.html'
  cards=parse_cards(snapshot.read_text())
  assert cards, str(snapshot)
  pages.append({'number':number,'path':path if number==1 else path+f'index_{number}.html','products':cards,'sourceSnapshot':str(snapshot)})
 catalog.append({'id':ident,'label':label,'path':path,'description':description,'image':asset(heroSrc),'pages':pages})
 print(label,[(p['number'],len(p['products'])) for p in pages],flush=True)
Path('src/content/live-site/categories.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
(ROOT/'assets.json').write_text(json.dumps(newassets,ensure_ascii=False,indent=2)+'\n')

Path("src/content/live-site/category-routes.json").write_text(json.dumps([{ "id": c["id"], "label": c["label"], "path": c["path"], "pageCount": len(c["pages"]) } for c in catalog],ensure_ascii=False,indent=2)+"\n")
