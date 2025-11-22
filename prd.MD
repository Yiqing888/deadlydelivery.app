好，那我直接给一份可以丢给 AI 编程助手就能开干的详细 PRD。
我会按“产品 → 交互 → 数据结构 → 简单算法”来写，方便你后面拆成代码。

⸻

0. 产品概述

产品名（暂定）：
Deadly Delivery Run Planner（你可以后面改成自己想要的域名/品牌）

一句话目标：
给《Deadly Delivery》（Roblox 版）的玩家，在每一局结束楼层时，提供一个**“要不要再下一层 + 背包怎么调”**的决策工具，同时附带物价表、怪物速查、职业规划等轻量攻略模块。 ￼

适用对象：
	•	平时看攻略但记不住数值、怪物的普通玩家
	•	想最大化利润的“数值党”
	•	想规划职业解锁顺序的新手/回坑玩家 ￼

平台：
	•	Web 工具站（移动端优先，PC 也友好）
	•	不与游戏进程交互，仅作为外部参考（避免被视为外挂）

⸻

1. 竞品与差异点（简短说明）

1.1 现有资源
	•	Wiki / 资讯站：Bloxinformer、Deadly Delivery Wiki，提供物品、职业、怪物基础信息。 ￼
	•	新手攻略 & 职业指南：Sportskeeda、DroidGamers、ProGameGuides 等，写的是图文教程和职业强度榜。 ￼
	•	怪物攻略：Destructoid、Gamezebo、DroidGamers 的 Monsters Guide，教你各个实体怎么打。 ￼
	•	已有工具站：deadlydelivery.org，号称有 Wiki、怪物指南和“profit calculators”。 ￼

1.2 我们的差异化
	•	不是单纯展示信息，而是做成**“一键决策工具”**：
	•	当前楼层 + 背包 + 队友情况 → 输出“撤离 / 深入”的建议（止盈计算器） ￼
	•	更强调移动端快速操作：适合玩家一局结束拿出手机点 5 下，就知道该不该贪。
	•	把物价、怪物、职业这些零散信息，收敛成几个简单问题：
	•	要不要再下一层？
	•	背包里哪些应该丢？
	•	我接下来要练哪个职业？

⸻

2. 用户场景 & 核心需求

2.1 典型场景
	1.	局中投票期（核心场景）
	•	玩家刚清完一层，正处于“下不下去”的投票。
	•	手头物资不少，但心理摇摆。
	•	打开手机进入工具，2–3 步输入后，得到一句清晰建议：
“建议撤离：你当前背包价值已经高于本局合理上限，下一层风险偏高。”
	2.	开局前准备
	•	想查一眼：
	•	这游戏哪些物品最值钱？
	•	哪个职业适合自己先解锁？ ￼
	3.	新手刚入坑
	•	想要一个“前 10 局该怎么打”的简单计划，而不是 4000 字长文。

2.2 核心需求（提炼）
	•	快速：10 秒内完成一次决策。
	•	简单：不要求玩家知道“EV”是什么，只给可执行建议。 ￼
	•	权威：物价、怪物信息要与当前版本保持一致（可人工维护）。

⸻

3. 整体信息架构（IA）

推荐路由结构（Next.js / 任意前端都可以照抄）：
	•	/ 首页 = 止盈计算器（核心）
	•	/items 物价 & 价值密度表
	•	/monsters 怪物速查 + 练习
	•	/classes 职业规划器
	•	/roadmap 新手前 10 局计划生成
	•	/about 关于 & 数据来源

顶部用一个简单导航栏，移动端为汉堡菜单。

⸻

4. 功能模块详细 PRD

4.1 模块 A：止盈计算器（Sewer Sherpa）

功能目标：帮玩家在每一层结束时判断“要不要再下一层”。

A.1 页面结构
	•	路由：/
	•	主要区域分三块：
	1.	当前局势输入区
	2.	结果 & 建议卡片
	3.	可选：高级设置展开区

A.2 输入字段定义（前端表单）
	1.	当前楼层 currentFloor（必填）
	•	类型：数字选择器 / 下拉
	•	范围：1–20（预留更多） ￼
	2.	目标楼层 targetFloor（可选，默认 = currentFloor + 1）
	•	如果玩家只想评估“下一层”，就用默认。
	3.	队伍存活人数 alivePlayers
	•	类型：单选按钮/步进器（1–4）
	4.	玩家职业 playerClass
	•	下拉，选项：Odd Jobber / Veterinarian / Chef / Sprinter / Baseballer / Porter ￼
	•	默认：Odd Jobber
	5.	背包总价值 inventoryValue（二选一方式）
	•	方式 1：快速输入模式（默认）
	•	数字输入框：玩家自己估个“当前背包总价”（他们可以看游戏里的 Album）。 ￼
	•	方式 2：详细选择模式（可选切换）
	•	点击“详细填背包”按钮，展开物品列表（来自 Items 数据表，见后面数据结构）。
	•	每个物品一行：图标 + 名称 + 价值 + 格数 + 数量输入框。
	6.	剩余时间 / 倒计时 timeLeftTier（可选）
	•	单选：
	•	60s
	•	30–60s
	•	< 30s
	•	用来粗略调整“超时风险”。
	7.	风险偏好 riskPreference（可选）
	•	单选：
	•	保守
	•	中性（默认）
	•	冒险
	•	影响阈值线。

A.3 后台/前端计算逻辑（简化数学）
这部分写得给 AI 模型看，方便它写代码：
	1.	楼层基础风险 floorRiskBase（硬编码表）

const floorRiskBase: Record<number, number> = {
  1: 0.05,
  2: 0.10,
  3: 0.20,
  4: 0.35,
  5: 0.50,
  6: 0.65,
  7: 0.75,
  8: 0.85,
  9: 0.90,
  10: 0.95
  // >10 默认 0.97
};

表示从某层到下一层的死亡概率初始值（可配置，不需要真实准确，先给一个“越来越危险”的曲线）。 ￼

	2.	队伍人数修正 teamModifier

function teamModifier(alivePlayers: number): number {
  if (alivePlayers >= 4) return -0.10; // 人多一点更安全
  if (alivePlayers === 3) return -0.05;
  if (alivePlayers === 2) return 0;
  return +0.05; // 单排略危险
}


	3.	职业修正 classModifier（基于职业强度 & 生存向属性） ￼

function classModifier(playerClass: string): number {
  switch (playerClass) {
    case "Porter":      return -0.05; // 能背多点、移速较好
    case "Sprinter":    return -0.05; // 速度快方便跑路
    case "Veterinarian":return -0.03; // 恢复能力
    case "Baseballer":  return -0.02; // 战斗更强
    case "Chef":        return 0;
    case "Odd Jobber":
    default:            return +0.02; // 新手职业略劣势
  }
}


	4.	时间修正 timeModifier

function timeModifier(timeLeftTier: "HIGH" | "MID" | "LOW" | null): number {
  if (!timeLeftTier) return 0;
  if (timeLeftTier === "HIGH") return -0.02;
  if (timeLeftTier === "MID")  return 0;
  return +0.05; // 时间少就危险
}


	5.	风险偏好修正 riskPrefModifier

function riskPrefModifier(pref: "SAFE" | "NORMAL" | "RISKY"): number {
  if (pref === "SAFE")   return -0.05; // 让模型更保守
  if (pref === "RISKY")  return +0.05;
  return 0;
}


	6.	最终死亡概率 deathProb 与生存率 survivalRate

function calcDeathProb(params): number {
  const base = floorRiskBase[params.currentFloor] ?? 0.97;
  let p = base
    + teamModifier(params.alivePlayers)
    + classModifier(params.playerClass)
    + timeModifier(params.timeLeftTier)
    + riskPrefModifier(params.riskPreference);

  // clamp 到 [0.05, 0.99]
  p = Math.max(0.05, Math.min(0.99, p));
  return p;
}

const deathProb = calcDeathProb(...);
const survivalRate = 1 - deathProb;


	7.	预估下一层收益 expectedGainNextFloor
先给一个简单模型：
	•	假设平均每层可以新增 baseGainPerFloor，可以设成常数，比如 300–500 金币，或者按楼层略微增加。
	•	可以根据职业做一点调整（如 Porter 更适合深挖）。

function estimateGain(currentFloor: number, playerClass: string): number {
  let base = 300 + currentFloor * 50; // 楼层越深理论收益越高
  if (playerClass === "Porter") base *= 1.15;
  if (playerClass === "Sprinter") base *= 1.10;
  return base;
}


	8.	核心对比：现在撤 vs 再下一层 EV

const V = inventoryValue; // 当前背包价值
const G = estimateGain(currentFloor, playerClass); // 下一层平均新增价值
const S = survivalRate;

const evStay = V;         // 现在撤离 = 锁定当前价值
const evGo   = (V + G) * S;

const diff = evGo - evStay;
const diffRatio = diff / V; // 增幅百分比


	9.	决策阈值（示例）
	•	如果 diffRatio < -0.1（期望大幅下降）→ 强烈建议撤离
	•	如果 -0.1 <= diffRatio <= +0.1 → 根据风险偏好给模棱两可建议
	•	如果 diffRatio > +0.1 → 可以考虑深入
再结合当前楼层和背包价值的一些“经验线”（比如 Floor 1 带走超过 500，Floor 3 带走超过 1500 就很赚），作为文案补充。

A.4 输出内容设计
结果卡片内容：
	•	颜色：
	•	红 = 撤离
	•	绿 = 深入
	•	灰 = 看情况
	•	文案示例：
	•	标题：
	•	“建议撤离”
	•	“可以尝试深入一层”
	•	核心理由（1–2 句话）：
	•	“按当前情况，继续深入的期望收益比现在撤高 5%，但死亡概率约 45%，已经偏高。”
	•	数值摘要：
	•	当前背包价值：V
	•	估算下一层新增：G
	•	预计死亡概率：deathProb（用“中等 / 高 / 极高”分级，不直给百分比也行）
	•	小建议：
	•	如果是高楼层：提醒怪物更强（引用 / 链接到怪物页）。 ￼

⸻

4.2 模块 B：物价 & 价值密度表 /items

目标：让玩家快速知道什么该捡、什么该扔。

B.1 页面结构
	•	顶部：筛选和排序区
	•	中部：表格/卡片列表
	•	底部：说明 & 更新日期

B.2 数据字段（单个物品 Item）
参考 wiki 中 Album / items 信息，字段如下： ￼

interface Item {
  id: string;          // 唯一 ID，英文 slug
  name: string;        // 显示名，如 "Old Wine"
  alias?: string[];    // 其他叫法、翻译
  value: number;       // 售价
  slots: number;       // 占用背包格数
  category: "Food" | "Drink" | "Special" | "Medical" | "Other";
  floors?: number[];   // 常见楼层
  notes?: string;      // 简单说明
}

前端根据 value / slots 计算 valuePerSlot 排序。

B.3 交互需求
	•	支持按价值/格子排序（默认）
	•	支持按价值排序
	•	支持按品类过滤
	•	支持搜索（模糊匹配名称）

选中某个物品行时，对应到止盈计算器内的“详细背包选择”模块可重用这份数据。

⸻

4.3 模块 C：怪物速查 & 记忆训练 /monsters

目标：压缩冗长攻略，做成一页速查 + 小测验。

C.1 数据结构 Monster
结合怪物攻略里的信息：名称、攻击方式、出现楼层、应对方法等。 ￼

interface Monster {
  id: string;
  name: string;              // Fire Turkey, Pit Maw...
  nickname?: string;         // 玩家常用叫法
  floors?: number[];         // 常见楼层
  dangerLevel: 1 | 2 | 3;    // 1=低 3=高
  descriptionShort: string;  // 一句话特征
  attackPattern: string;     // 怎么伤害你
  counterStrategy: string;   // 怎么躲/怎么打
  notes?: string;
}

C.2 页面内容
	•	速查模式：
	•	列表显示所有怪物卡片
	•	每张卡片包含：名称、图标（可选）、一行特征、一行打法、危险度（用小图标/颜色）
	•	训练模式：
	•	按“练习”按钮后：
	•	随机抽一个怪物
	•	展示：特征 + 简短描述
	•	下面三条选项，分别是不同打法（正确答案 + 2 条错误干扰项）
	•	提交后显示正确答案与解释。

⸻

4.4 模块 D：职业规划器 /classes

目标：帮助玩家决定先解锁/升级哪个职业。 ￼

D.1 数据结构 Class

interface ClassInfo {
  id: string;         // "Odd Jobber"
  name: string;
  unlockCost: number; // 解锁金币
  tier: "S" | "A" | "B" | "C"; // 综合强度
  role: "DPS" | "Support" | "Carry" | "Runner"; // 便于说明
  description: string;       // 简短定位说明
  pros: string[];            // 优点 bullet
  cons: string[];            // 缺点 bullet
  recommendedFor: string[];  // 适合风格，如 "喜欢单排"
}

D.2 交互逻辑
	•	用户输入：
	•	自己当前金币数 currentGold
	•	偏好的玩法风格（单选）：
	•	稳健打钱 / 喜欢战斗 / 喜欢跑路 / 喜欢辅助队友
	•	输出：
	•	推荐 1–2 条职业解锁顺序，比如：
“从 Odd Jobber 开始 → 攒到 10,000 → 解锁 Sprinter → 再冲 30,000 解锁 Porter。”

你可以后面扩成更复杂的“多局规划”，现在只需要静态规则即可。

⸻

4.5 模块 E：新手前 10 局计划 /roadmap

目标：用非常短的文字，给新手一个可执行的“前几局策略”，不需要很精确。

E.1 输入
	•	风格：保守 / 一般 / 贪一点
	•	是否有固定队友：有 / 没有

E.2 输出结构
以数组形式返回 1–10 局的建议：

interface RunPlan {
  runIndex: number;       // 第几局
  targetFloor: number;    // 推荐最多到几层
  focus: string;          // 本局目标：熟悉地图 / 赚钱 / 解锁职业等
  tips: string[];         // 2-3 条操作建议
}

页面上按局数展示成时间线样式即可。

建议写死一套规则，比如：
	•	1–3 局：不建议下 2 层，优先熟悉怪物和地图；
	•	4–6 局：尝试下 2–3 层，背包超过 X 金币就撤；
	•	7–10 局：根据用户“风格”进行微调。

⸻

5. UX / 页面交互细节（给前端/AI 用）

5.1 通用 UI 要求
	•	移动端：
	•	单列布局
	•	表单控件要大，方便手指点
	•	颜色规范：
	•	建议只定义 3 个主色：中性色、成功绿、警告红
	•	文案风格：
	•	提示语简短、偏口语，比如：
	•	“这局已经很赚了，可以收工。”
	•	“收益还没回本，再下一层问题不大。”

5.2 止盈计算器页面伪线框（文字描述）

从上到下：
	1.	标题：
	•	“Should you go deeper?”（英文为主，你可以加中英双语）
	2.	简短说明行：
	•	“Select your floor, backpack value, and teammates. We’ll estimate the risk of going one more floor.”
	3.	表单区：
	•	currentFloor：滑块/步进器
	•	alivePlayers：1–4 的按钮
	•	playerClass：下拉
	•	inventoryValue：
	•	文本输入 + “Use detailed inventory” 链接（切换模式）
	•	展开区：timeLeftTier + riskPreference
	4.	“Calculate” 按钮
	5.	结果卡片：
	•	大标题 + 颜色条
	•	3–4 行摘要数值
	•	1 段理由
	•	1 行小提示（可链接到怪物/物品页）
	6.	底部小字：
	•	“This is a helper tool based on estimated data, not official game data.”

⸻

6. 数据来源 & 存储方式

6.1 数据来源
	•	物品信息：来自 Bloxinformer / 游戏内 Album（人工录入到 items.json） ￼
	•	职业信息：来自各类职业指南、tier list（解锁费用、定位） ￼
	•	怪物信息：来自官方 wiki + Monsters 指南  ￼

6.2 存储形态建议

为了简单，你可以让 AI 直接实现为静态 JSON 文件：
	•	/data/items.json
	•	/data/monsters.json
	•	/data/classes.json

前端直接 import 或 fetch 这些静态文件即可，无需后端数据库。
如果你打算后面扩展玩家投稿数据，再考虑接 Supabase 之类的。

⸻

7. MVP 范围（第一版一定要做完的）

必须上线：
	1.	止盈计算器（A）：
	•	快速输入模式（不做详细背包选择也可以）
	•	简化风险模型 + EV 对比
	2.	物价表（B）：
	•	至少录入 20–40 个常见物品
	•	支持按价值/格子排序
	3.	怪物速查（C）：
	•	至少录入主流怪物：Pit Maw、Fire Turkey、Fridge Mimic、Running Food、Mimic/Clone、Crocodile、Puppet 等 ￼

可以留到 v1.1+：
	•	怪物训练模式
	•	职业规划器
	•	新手 10 局计划

⸻

8. 技术 & 非功能要求（建议）

8.1 技术栈（建议，不是硬性）
	•	前端：Next.js + React
	•	样式：Tailwind CSS
	•	部署：Vercel（方便你继续沿用）

8.2 性能 & 体验
	•	所有计算在前端完成，不依赖服务端延迟。
	•	页面初次加载资源 < 1MB 为目标。

8.3 SEO / 文案
	•	每个页面要有明确 <title>，比如：
	•	“Deadly Delivery Profit & Risk Calculator – Run Planner”
	•	在物价页/职业页加一段简短介绍，方便收 SEO 流量。

⸻

9. 指标 & 后续优化方向（给未来留钩子）

后续如果你愿意接埋点（如 Plausible/自托管），可以重点看：
	•	止盈计算器使用次数
	•	每次访问停留时间
	•	哪些楼层/背包价值组合访问最多
	•	用户是否从 /items 跳回 /（说明他们有查价需求）

再进一步，你可以开一个匿名反馈表（Tally / Typeform），问两件事：
	1.	“你觉得我们的建议太保守、太激进，还是刚刚好？”
	2.	“有没有哪一局你觉得工具明显判断错了？”

这些都可以用来慢慢调 floorRiskBase 等参数。

⸻

如果你愿意，下一步我可以直接帮你：
	•	把数据结构 + 算法函数用 TypeScript 写成一份 core.ts，
	•	再给你一个简单的 React 组件骨架，让你丢给 Cursor / 其他大模型直接生成完整站点。

⸻

10. 用户优先级与场景排序（补充说明）

10.1 用户画像优先级
	•	MVP 主要优先服务的对象是：
		•	“局间犹豫要不要再下一层的普通玩家”，他们在投票阶段只有十几秒，需要一个冷静的“止盈建议”。
	•	次要服务对象：
		•	喜欢看数值、愿意研究 EV 的“数值党”；
		•	刚入坑或回坑、需要轻量攻略的新手玩家。

10.2 场景优先级
	•	场景优先级排序：
		1.	局中投票期（是否再下一层的关键决策）；
		2.	开局前准备（查物价、看职业/怪物简表）；
		3.	新手学习（看前几局的打法建议）。
	•	产品在做取舍时，优先保证“局中投票期”的体验流畅、简单、可靠。

⸻

11. 算法参数示例表（便于后续调参）

说明：以下参数为“第一版示例”，用于让实现方有一个明确的起点。后续可以根据实战反馈和数据随时调整。

11.1 楼层风险基线（示例）
	•	Floor 1：基础死亡率 10%
	•	Floor 2：基础死亡率 20%
	•	Floor 3：基础死亡率 30%
	•	Floor 4：基础死亡率 40%
	•	Floor 5：基础死亡率 50%
	•	Floor 6+：可按每层 +10% 或封顶在 80–90% 左右

11.2 队友人数修正系数（示例）
	•	1 人：风险系数 × 1.10（单排更危险）
	•	2 人：风险系数 × 1.00
	•	3 人：风险系数 × 0.90
	•	4 人：风险系数 × 0.80（满编队伍更稳）

11.3 风格 / 风险偏好修正（示例）
	•	保守：要求“下一层的 EV 明显大于当前 EV”才建议深入，可理解为 EV 阈值 +10%；
	•	中性：默认阈值，不做额外调整；
	•	冒险：允许在“下一层 EV 稍微高一点”甚至“差不多”的情况下也给出深入建议，可理解为阈值 −10%。

11.4 价值密度与“已经很赚了”的定义（示例）
	•	可以设定一个“本局合理上限估计值”，例如：
		•	假设玩家当前楼层 Floor = F，预估单层正常收益基础值为 baseGain(F)；
		•	当当前背包价值 ≥ baseGain(F) × 2 时，界面文案偏向“已经很赚了，可以考虑撤离”；
		•	当当前背包价值 ≥ baseGain(F) × 3 时，强烈偏向撤离建议。
	•	baseGain(F) 可以非常粗略，例如：Floor 1 为 200，之后每层 +150，后续再根据真实体验调整。

（实现时不要求完全照抄以上数字，更重要是：把这些参数单独抽出来，方便以后整体上调/下调。）

⸻

12. 数据维护与版本更新策略

12.1 数据字段预留
	•	在静态数据（items, monsters, classes）中预留用于维护的字段，例如：
		•	`source`：数据来源链接或简要备注（例如“Bloxinformer + 游戏内 Album”）；
		•	`lastUpdated`：数据最后更新日期（例如 `"2025-01-01"`）；
		•	`gameVersion`：对应的游戏大版本或简要版本号（例如 `"Season 3"`）。
	•	这些字段主要用于给维护者参考，不一定在前端 UI 中全部展示。

12.2 维护人和维护节奏（简单约定）
	•	默认由站长/你自己维护，必要时可以从社区收集反馈做修正；
	•	建议的检查节奏：
		•	每次 Deadly Delivery 发布较大更新（如新版本、平衡性改动）后，检查 items.json 和 monsters.json；
		•	优先保证高频物品（常见食物、高价值物品）和主流怪物（常见致死原因）的数值和描述准确。

12.3 更新后的回归要求（简单版）
	•	更新数据后，至少手动验证：
		•	止盈计算器仍能正常运算、文案含义没有明显错误；
		•	/ items 和 /monsters 页面可以正常加载，不出现明显的“缺字段导致报错”问题。

⸻

13. 交互边界与错误状态处理

13.1 必填字段与禁用状态
	•	止盈计算器中，至少以下字段为必填：
		•	currentFloor（当前楼层）
		•	alivePlayers（队伍存活人数）
		•	inventoryValue（当前背包总价值，快速模式下为一个数字）
	•	在这些字段未填写完整前，“Calculate / 计算”按钮默认禁用，或点击时给出简短提示（如：“请先选择楼层和背包价值”）。

13.2 极端值与异常输入
	•	楼层超过设计上限时（例如 >20），前端可：
		•	限制最大输入值；或
		•	给出提示：“当前版本经验有限，超过该楼层的评估仅供参考。”
	•	背包价值填入极端大数字（例如 999999）时：
		•	不阻止计算，但显式标记为“极端贪婪”，默认强烈建议撤离；
		•	同时可以在结果文案中加一行小字提示：“该数值远高于正常局期望，请自行斟酌。”

13.3 数据不完整 / 计算异常时的回退策略
	•	若某个物品缺少 value / slots 字段：
		•	在详细背包模式中，可以将该物品标记为“N/A”，不计入总价值，或干脆不在列表中展示；
	•	若算法内部出现异常（例如除以 0、参数为 undefined）：
		•	前端显示一个友好的错误提示，而不是空白页面；
		•	例如：“抱歉，这一局的计算出错了，请稍后重试或检查输入。”

⸻

14. 文案与语言风格策略

14.1 语言策略
	•	第一版以英文界面为主，关键位置可以加上简短中文翻译（中英双语），例如：
		•	“EVACUATE（撤离）”、“GO DEEPER（再下一层）”；
	•	未来如果你愿意，可以考虑提供完整的多语言切换。

14.2 语气与风格
	•	整体语气：
		•	偏口语、偏友好、不过度严肃，也不过度玩梗；
		•	给人一种“冷静队友/教练”的感觉，而不是一板一眼的系统提示。
	•	文案示例延伸：
		•	“这局已经很赚了，可以收工。”
		•	“收益还没回本，再下一层问题不大。”
		•	“现在再下一层有点贪了，小心团灭。”

14.3 关键术语统一
	•	在全文和 UI 中尽量保持术语统一，例如：
		•	“EVACUATE / 撤离” 统一用这对词；
		•	“GO DEEPER / 再下一层” 统一用这对词；
		•	“Expected Value / EV / 期望收益” 如需出现时，尽量成对出现（如：“EV（期望收益）”），方便新手理解。

⸻

15. 实现复盘（2025-11-22）

15.1 已上线内容
	•	止盈计算器：支持快速模式 + 详细背包构建、current/target floor、多种风险修正以及 EV 结果卡片。
	•	/items：24 种常见物品，支持搜索、品类过滤、按价值/格子/密度排序；数据含来源与更新时间字段。
	•	/monsters：Pit Maw、Fire Turkey 等主流实体的速查卡片，危险度标记与打法摘要齐全。
	•	/classes：静态职业资料卡 + 根据金币与玩法偏好给出的解锁路线规划器。
	•	/roadmap：输入风格与是否有固定队友，生成前 10 局建议（目标楼层 + Tips）。
	•	/about：项目说明、数据来源、贡献方式与后续 Roadmap。导航/页脚已串起全部路由。

15.2 尚未交付的需求
	•	怪物训练模式（选择题/记忆练习）仍在 backlog。
	•	职业规划器暂为静态规则，未来若要多局规划需补充更多参数。
	•	未接入玩家投稿与数据维护后台（当前为静态 TS 文件）。
	•	暂未添加埋点/匿名反馈入口，需等站点稳定后考虑。

15.3 后续注意事项
	•	risk 模型和物价表依赖人工维护，建议根据玩家反馈（例如“太保守/太激进”）定期调 `floorRiskBase` 和 `items` 数据。
	•	若要支持多语言，请先梳理术语映射，避免页面中/英文夹杂失控。
	•	上线前配置 ESLint/格式化，避免因构建或可访问性问题阻塞发布。
