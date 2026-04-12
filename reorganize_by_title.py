import json
import os
import re

# Precise Category Mapping based on Keywords in TITLES
CATEGORIES = {
    "AIknowledge": {
        "name": "AI 知识 / 人工智能",
        "keywords": [r'AI', r'人工智能', r'ChatGPT', r'DeepSeek', r'Claude', r'AIGC', r'提示词', r'绘画', r'Stable Diffusion', r'Midjourney', r'大模型', r'智能体', r'算力', r'Bot', r'训练营.*AI'],
        "seo_keywords": "AI, 人工智能, AIGC, DeepSeek, ChatGPT, 提示词, 绘画"
    },
    "movies": {
        "name": "影视娱乐 / 短剧",
        "keywords": [r'影视', r'电影', r'电视剧', r'剧', r'短剧', r'4K', r'蓝光', r'视频', r'纪录片', r'记录片', r'动漫', r'动画', r'综艺', r'TV', r'MV', r'演唱会', r'写真', r'写真集', r'素材'],
        "seo_keywords": "影视资源, 电影下载, 电视剧全集, 短剧合集, 4K电影, 动漫"
    },
    "book": {
        "name": "精品书籍 / 小说漫画",
        "keywords": [r'书籍', r'电子书', r'古籍', r'PDF', r'小说', r'漫画', r'文献', r'图书', r'杂志', r'周刊', r'读物', r'名著'],
        "seo_keywords": "精品书籍, 电子书下载, PDF书籍, 资料下载, 漫画小说"
    },
    "curriculum": {
        "name": "学习课程 / 职场技能",
        "keywords": [r'课程', r'教程', r'学习', r'实战', r'训练营', r'入门', r'进阶', r'职场', r'技能', r'讲座', r'考试', r'考研', r'考公', r'培训', r'讲义', r'全套', r'架构师', r'编程', r'开发', r'算法', r'Python', r'Java', r'UI', r'设计', r'插画', r'子比主题', r'wordpress插件', r'wordpress'],
        "seo_keywords": "在线课程, 学习资料, 视频教程, 技能提升, 职场提升, 编程教程"
    },
    "self-media": {
        "name": "自媒体 / 电商运营",
        "keywords": [r'自媒体', r'抖音', r'TikTok', r'小红书', r'运营', r'变现', r'带货', r'流量', r'SEO', r'营销', r'电商', r'淘宝', r'拼多多', r'闲鱼', r'写作', r'剪辑', r'涨粉', r'私域', r'引流', r'群发'],
        "seo_keywords": "自媒体运营, 电商干货, 流量变现, 抖音运营, 小红书运营, 赚钱项目"
    },
    "edu-knowlege": {
        "name": "教育资源 / 学科知识",
        "keywords": [r'教育', r'小学', r'初中', r'高中', r'幼儿', r'启蒙', r'知识点', r'绘本', r'学科', r'语文', r'数学', r'英语', r'奥数', r'中考', r'高考', r'刷题'],
        "seo_keywords": "教育资源, 学习知识, 考试资料, 历史故事, 学科知识, 幼儿教育"
    },
    "healthy": {
        "name": "健康养生 / 体育健身",
        "keywords": [r'健康', r'养生', r'健身', r'瑜伽', r'中医', r'康复', r'心理', r'营养', r'饮食', r'按摩', r'推拿', r'针灸', r'国医', r'电工', r'MBTI'],
        "seo_keywords": "健康养生, 体育健身, 中医养生, 健身教程, 心理健康"
    },
    "tools": {
        "name": "软件工具 / 实用插件",
        "keywords": [r'软件', r'工具', r'插件', r'App', r'系统', r'绿化', r'安卓', r'电脑', r'PC', r'Windows', r'手机', r'驱动', r'提效', r'脚本', r'浏览器', r'编辑器', r'解锁', r'会员版', r'恢复大师', r'去字幕', r'配音王', r'音效', r'转应用'],
        "seo_keywords": "工具软件, 会员版软件, 插件下载, 绿色软件, 提效工具, 安卓应用"
    },
    "chinese-traditional": {
        "name": "传统文化 / 国学精粹",
        "keywords": [r'传统文化', r'国学', r'周艺', r'易经', r'八字', r'风水', r'紫微', r'梅花易数', r'命理', r'书法', r'绘画.*国画'],
        "seo_keywords": "传统文化, 国学精粹, 周易易经, 风水命理, 文化传承"
    }
}

def clean_title(title):
    if not title: return ""
    title = title.replace('\u200b', '').strip()
    title = title.replace('破解', '会员版')
    title = title.replace('软件工具', '会员版软件')
    title = re.sub(r'^[【「\[\( 🎵🎬🤖🎓📚🛠️🔥✨🚀✅]+', '', title)
    title = re.sub(r'[】」\]\) ]+$', '', title)
    title = re.sub(r'https?://[^\s]+', '', title).strip()
    return title

def get_best_category(title, raw_cat):
    for cat_id, info in CATEGORIES.items():
        for pattern in info["keywords"]:
            if re.search(pattern, title, re.IGNORECASE):
                return cat_id
    for cat_id, info in CATEGORIES.items():
        for pattern in info["keywords"]:
            if re.search(pattern, raw_cat, re.IGNORECASE):
                return cat_id
    return "tools"

def reorganize():
    with open("all_resources_full.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    unique_links = {}
    for raw_cat, res_list in data.items():
        raw_cat = raw_cat.replace('破解', '会员版').replace('软件工具', '会员版软件')
        for res in res_list:
            link = res.get("link", "").strip()
            if not link: continue
            
            title = clean_title(res.get("title", ""))
            is_placeholder = re.match(r'^(会员版软件|资源|精选|资料|post|unknown|精品)\d*$', title, re.IGNORECASE) is not None
            
            if link not in unique_links:
                unique_links[link] = {
                    "title": title,
                    "raw_cat": raw_cat,
                    "type": res.get("type", res.get("网盘类型", "网盘资源")),
                    "is_placeholder": is_placeholder,
                    "rich_description": res.get("rich_description", None)
                }
            else:
                if unique_links[link]["is_placeholder"] and not is_placeholder:
                    unique_links[link]["title"] = title
                    unique_links[link]["is_placeholder"] = False
                elif not is_placeholder and len(title) > len(unique_links[link]["title"]):
                    unique_links[link]["title"] = title
                
                if not unique_links[link]["rich_description"] and res.get("rich_description"):
                    unique_links[link]["rich_description"] = res.get("rich_description")

    grouped = {cat_id: {"resources": [], "placeholders": []} for cat_id in CATEGORIES}
    grouped["tools"] = {"resources": [], "placeholders": []}

    for link, info in unique_links.items():
        cat_id = get_best_category(info["title"], info["raw_cat"])
        res_obj = {"title": info["title"], "link": link, "type": info["type"], "rich_description": info["rich_description"]}
        
        if info["is_placeholder"] or len(info["title"]) < 2:
            grouped[cat_id]["placeholders"].append(res_obj)
        else:
            grouped[cat_id]["resources"].append(res_obj)

    project_root = "resource-portal/docs"
    total_files = 0
    
    for cat_id, data_group in grouped.items():
        target_dir = os.path.join(project_root, cat_id)
        os.makedirs(target_dir, exist_ok=True)
        
        resources = sorted(data_group["resources"], key=lambda x: x['title'])
        placeholders = data_group["placeholders"]
        cat_info = CATEGORIES.get(cat_id, {"name": "其它资源", "seo_keywords": "资源下载"})
        
        index_entries = []

        for i, res in enumerate(resources):
            post_id = f"post_{i+1:03d}"
            title = res["title"]
            res_type = res["type"]
            link = res["link"]
            
            # Use rich description if available
            body_desc = res["rich_description"] if res["rich_description"] else f"欢迎访问小二郎资源分享站！本页面提供 **{title}** 的免费下载链接。该资源经过深度整理，旨在为您提供优质的学习与研究素材。"
            
            content = f"""---
title: "{title}"
description: "点击免费下载 {title}。小二郎资源分享站深度整理，分类：{cat_info['name']}。"
keywords: "{cat_info['seo_keywords']}, {title}"
---

# {title}

<Badge type="tip" text="{res_type}" /> <Badge type="warning" text="精品资源" />

## 📋 资源介绍
{body_desc}

## 📥 资源详情
- **资源名称**: {title}
- **所属分类**: {cat_info['name']}
- **更新日期**: 2026-04-10
- **直达链接**: <a href="{link}" target="_blank" rel="noopener noreferrer" class="download-link">🔗 点击获取网盘资源</a>

---
### 🛡️ 申明与反馈
- **版权申明**: 本站所有资源均收集自互联网，版权归原作者所有。仅供个人学习研究，请于下载后24小时内删除。
- **链接失效**: 如果您发现下载链接已失效，请联系管理员核实。

---
💡 **更多资源**: 返回 [小二郎资源分享站](/) 
"""
            with open(os.path.join(target_dir, f"{post_id}.md"), "w", encoding="utf-8") as f:
                f.write(content)
            index_entries.append(f"| {title} | {res_type} | [点击进入](/{cat_id}/{post_id}) |")
            total_files += 1

        if placeholders:
            coll_id = "collection"
            coll_title = f"🎁 {cat_info['name']} - 精选资源合集"
            rows = ""
            for p in placeholders:
                p_title = p["title"] if p["title"] else "精品资源"
                p_title = p_title.replace('软件工具', '会员版软件').replace('破解', '会员版')
                rows += f'| {p_title} | {p["type"]} | <a href="{p["link"]}" target="_blank">🔗 打开</a> |\n'
            
            coll_content = f"""---
title: "{coll_title}"
---

# {coll_title}

| 资源 | 平台 | 操作 |
| :--- | :--- | :--- |
{rows}
"""
            with open(os.path.join(target_dir, f"{coll_id}.md"), "w", encoding="utf-8") as f:
                f.write(coll_content)
            index_entries.append(f"| {coll_title} | 多平台 | [点击进入](/{cat_id}/{coll_id}) |")

        index_content = f"""---
title: "{cat_info['name']}"
---

# {cat_info['name']} 资源合集

| 资源名称 | 平台 | 详情 |
| :--- | :--- | :--- |
""" + "\n".join(sorted(index_entries))
        
        with open(os.path.join(target_dir, "index.md"), "w", encoding="utf-8") as f:
            f.write(index_content)

    print(f"Reorganization complete. Total files: {total_files}")

if __name__ == "__main__":
    reorganize()
