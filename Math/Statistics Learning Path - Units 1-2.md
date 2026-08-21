---
layout: default
title: Statistics Learning Path — Units 1–2
permalink: /math/statistics-learning-path-units-1-2/
section: Mathematics
summary: A four-week path through categorical data and one-variable quantitative data, with emphasis on displays, descriptions, and conclusions.
---

# Statistics Learning Path — Units 1–2

这条学习路线围绕两个主题展开：

1. **Unit 1: Exploring categorical data**
2. **Unit 2: Exploring one-variable quantitative data: Displaying and describing**

路线默认按 **4 周、每周 4–5 次、每次 45–60 分钟**设计。如果每周学习时间不同，可以保留顺序，调整每个阶段的用时。

## Overall goal

完成两个单元后，我应该能够：

- 区分类别变量（categorical variable）和定量变量（quantitative variable）；
- 根据变量类型选择合适的表格或图形；
- 用比例、百分比和条件分布描述数据；
- 从图表中描述分布的形状、中心、离散程度和异常值；
- 用统计语言写出带有情境的结论；
- 区分“数据中存在关联”和“一个变量导致另一个变量”；
- 发现图表误导、样本比例不一致和比较方式不恰当的问题。

## Study routine for every session

每次学习完成以下五步，并把结果记录到本文件底部：

1. **Vocabulary** — 写出新术语、中文解释和一个例子。
2. **Display** — 画图或制作表格，不只阅读现成图表。
3. **Description** — 用完整句子描述数据，并保留变量的情境。
4. **Calculation** — 计算一个百分比、中心或离散程度指标。
5. **Reflection** — 记录一个错误、疑问或下一步。

描述数据时，先问自己：

> 变量是什么？数据来自谁？每个数字表示什么？图表是否保留了足够的情境？

## Foundation — Individuals, variables, and data types

### Individuals

**Individuals** are the objects, people, places, or cases being described by a dataset. Another name is **observational units**.

Examples:

- In a survey of students, each student is an individual.
- In a dataset about websites, each website can be an individual.
- In a dataset about posts, each post can be an individual.

Always ask: **What does one row represent?** That usually identifies the individuals.

### Variables

A **variable** is a characteristic recorded for each individual. A variable can have different values for different individuals.

For the website example:

| Individual | Variable | Value |
|---|---|---|
| Website A | number of writers | 5 |
| Website A | average likes per post | 3,500 |
| Website A | revenue | $30,000 |
| Website B | number of writers | 11 |

The website name identifies the individual. Writers, likes, and revenue are variables.

### Identifier versus variable

In the school-counselor example, each **student** is an individual:

| Student name | Homeroom teacher | Absences |
|---|---|---:|
| Arianna | Mr. Shea | 4 |

“Arianna” identifies the individual in that row. The variables being recorded are **homeroom teacher** and **number of absences**.

A name can technically be stored as a categorical variable in a database, but in this statistics question it is treated as an **identifier**, not as the characteristic being analyzed. The question is asking “Who are the individuals?”, so the answer is **the students**, not “student names.”

### Categorical variables

A **categorical variable** places individuals into groups or labels. Its values answer questions such as “which kind?” or “which group?”

Examples:

- website: A or B;
- favorite subject: math, chemistry, or physics;
- transportation: walk, bus, bicycle, or car;
- completed assignment: yes or no.

The categories may be written with words or numbers. A number is still categorical if it is only a label, such as a ZIP code, student ID, or jersey number.

### Quantitative variables

A **quantitative variable** records a numerical amount for which arithmetic has a meaningful interpretation. Its values answer questions such as “how many?” or “how much?”

Examples:

- number of writers;
- number of posts;
- average likes per post;
- revenue in dollars;
- temperature in degrees Celsius;
- travel time in hours.

Counts are quantitative and usually **discrete**. Measurements such as time, distance, and temperature are quantitative and can usually vary continuously.

### A reliable classification test

Use these questions in order:

1. What is one individual or observational unit?
2. What characteristic is recorded about it?
3. Is the value a label/group, or is it a meaningful numerical amount?
4. If it is a number, would adding or averaging the values make sense?

If it is a label or group, it is categorical. If it is a meaningful numerical amount, it is quantitative.

### Common traps

- A variable written with numbers is not automatically quantitative.
- “Student ID” is categorical because the digits are labels.
- “Number of siblings” is quantitative because adding and comparing counts is meaningful.
- “Favorite number” is categorical if the number is simply a chosen label or preference.
- The same characteristic can be a different variable depending on how it is recorded. Exact age is quantitative; age group such as “teenager” or “adult” is categorical.

### Foundation check

For each example, identify the individual and classify the variable:

- [ ] Each student’s favorite school subject.
- [ ] Each student’s number of hours studied.
- [ ] Each website’s monthly revenue.
- [ ] Each website’s category: entertainment, news, or education.
- [ ] Each post’s number of comments.

**Key idea:** Individuals are the “who or what.” Variables are the “what we record about them.” Data types tell us which displays and calculations are appropriate.

## Week 1 — Unit 1 foundations: categorical data

### Learning targets

- [ ] 我能定义 categorical variable、category、frequency 和 relative frequency。
- [ ] 我能从问题中判断变量是否是类别变量。
- [ ] 我能区分 count（人数/次数）和 proportion or percent（比例/百分比）。
- [ ] 我能解释一个类别的百分比，而不是只报出数字。

### Core concepts

**Categorical variable** 的取值是类别或标签，例如颜色、年级、是否参加活动。类别通常没有自然的数值顺序；即使类别用数字编码，它仍然可能是类别变量。

频数和相对频数：

$$
\text{relative frequency} = \frac{\text{category count}}{\text{total count}}
$$

$$
\text{percent} = \text{relative frequency} \times 100\%
$$

### Lesson 2 — Representing a categorical variable with graphs

The most useful graph for showing the counts of categories is a **bar graph**.

#### How to create a bar graph

1. Put the categories on the horizontal axis.
2. Put the frequency or relative frequency on the vertical axis.
3. Choose an even, clearly labeled scale.
4. Draw one bar for each category.
5. Leave spaces between bars because the categories are separate groups, not connected numerical intervals.
6. Add a title that names the variable and the population or sample.

Example data about students’ preferred transportation:

| Transportation | Number of students |
|---|---:|
| Bus | 8 |
| Car | 5 |
| Walk | 3 |
| Bicycle | 4 |

Text version of the bar graph:

```text
Preferred transportation (number of students)

Bus      ████████  8
Car      █████     5
Walk     ███       3
Bicycle  ████      4
```

This graph shows that **bus** is the most common category and **walking** is the least common category. It does not show that bus causes students to prefer it; it only describes the observed data.

#### Frequency versus relative frequency

- A graph of **frequency** uses counts, such as 8 students.
- A graph of **relative frequency** uses proportions or percentages, such as \(8/20=40\%\).

Use relative frequency when comparing groups with different total sizes. For example, 8 bus riders out of 20 students and 20 bus riders out of 100 students are not the same percentage.

#### How to read a bar graph

Look for:

- the category with the greatest or smallest bar;
- the frequency or percentage represented by a bar;
- the difference between two categories;
- the total sample size, if the graph provides it;
- a misleading scale, missing labels, or a missing title.

When comparing two groups, use the same categories and the same vertical scale. Compare percentages when the groups have different sample sizes.

#### Common mistakes

- Using a numerical line graph instead of a bar graph for categories;
- forgetting spaces between categorical bars;
- using unequal widths or an unclear vertical scale;
- comparing counts when the groups have different sample sizes;
- describing a graph without saying what the individuals or categories represent.

**Checkpoint:** I can make a labeled bar graph from a frequency table and write one sentence describing its highest, lowest, and most noticeable categories.

### Practice sequence

1. 从一个小调查中列出所有类别和每个类别的 count。
2. 计算每个类别的 relative frequency 和 percent。
3. 检查所有 count 的总和是否等于样本量。
4. 检查所有 relative frequencies 是否约等于 1，所有百分比是否约等于 100%。
5. 写两句解释，例如：“在接受调查的学生中，约有 __% 选择了 __。”

### Unit 1 checkpoint A

给定一份类别数据，我能够：

- [ ] 建立 frequency table 和 relative-frequency table；
- [ ] 选择 bar chart 或 pie chart，并说明选择理由；
- [ ] 避免把类别编码当成真正的定量测量；
- [ ] 用样本情境解释最大类别、最小类别和比例差异。

## Week 2 — Unit 1 displays, two-way tables, and association

### Learning targets

- [ ] 我能读懂 two-way table（双向表）。
- [ ] 我能计算 joint、marginal 和 conditional relative frequencies。
- [ ] 我能用 conditional distributions 比较两个群体。
- [ ] 我能描述两个类别变量之间是否存在 association。
- [ ] 我能区分 association、cause and effect 与 lurking variable。

### Two-way tables

双向表同时记录两个类别变量。阅读每个百分比前，必须先确认分母来自哪一行、哪一列或整个表。

常见的三种比例：

- **Joint relative frequency**：某一格的数量 ÷ 总人数；
- **Marginal relative frequency**：行总计或列总计 ÷ 总人数；
- **Conditional relative frequency**：某一格的数量 ÷ 指定条件下的行总计或列总计。

### Practice sequence

1. 为一份双向表标注行变量、列变量和总样本量。
2. 计算至少一个 joint、一个 marginal 和两个 conditional relative frequencies。
3. 用条件百分比比较两个群体，而不是只比较原始人数。
4. 画 segmented bar chart 或 mosaic plot，检查图形是否支持表格中的比较。
5. 写出结论模板：

   > 在 ______ 群体中，约有 ______% 的观测属于 ______；相比之下，在 ______ 群体中这一比例约为 ______%。这说明两个变量之间存在/没有明显的关联。该数据本身不能证明因果关系。

### Common traps

- 样本量不同时，不能只比较 count；
- “在 A 中有多少比例是 B”和“在 B 中有多少比例是 A”不是同一个问题；
- 图表中的关联不等于因果关系；
- 百分比的分母改变时，结论也可能改变；
- 总体比例可能掩盖分组后的不同趋势。

### Unit 1 mini-project

选择一个可复查的小问题，例如“学习方式与是否完成作业是否有关”。收集至少两个类别变量的数据，完成：

- [ ] 原始数据表；
- [ ] 频数表和相对频数表；
- [ ] 双向表；
- [ ] 一张合适的图；
- [ ] 两个条件分布的比较；
- [ ] 一段带情境的结论；
- [ ] 一句关于因果关系限制的说明。

## Week 3 — Unit 2 displaying one-variable quantitative data

### Learning targets

- [ ] 我能定义 quantitative variable、distribution、observation 和 unit。
- [ ] 我能选择 dotplot、stemplot、histogram 或 boxplot。
- [ ] 我能描述分布的 shape、center、spread 和 unusual features。
- [ ] 我能识别 skew、clusters、gaps、peaks 和 outliers。

### Core concepts

**Quantitative variable** 的取值是可以进行有意义的数值运算的测量或计数，例如身高、等待时间、温度和考试分数。

描述单变量定量数据时，使用 **SOCS**：

- **Shape** — 对称、左偏、右偏、单峰、多峰；
- **Outliers** — 是否有明显离群值；
- **Center** — 典型值在哪里；
- **Spread** — 数据分散到什么范围。

### Display selection

| Display | Best use | What to inspect |
|---|---|---|
| Dotplot | 小型数据集，保留每个观测值 | clusters、gaps、重复值、离群值 |
| Stemplot | 中小型数据集，保留数值顺序 | 形状、中心、尾部、具体观测值 |
| Histogram | 较大数据集，观察整体形状 | bins、峰、偏态、间隔、范围 |
| Boxplot | 快速概括中心和离散程度 | median、quartiles、IQR、离群值 |

### Practice sequence

1. 为同一组数据制作 dotplot 和 histogram。
2. 改变 histogram 的 bin width，观察图形如何改变。
3. 为数据制作五数概括（five-number summary）：最小值、第一四分位数、中位数、第三四分位数、最大值。
4. 计算 range 和 IQR。
5. 使用 SOCS 写一段完整描述，不把“看起来高”当作统计结论。

四分位距：

$$
IQR = Q_3 - Q_1
$$

### Unit 2 checkpoint A

给定一组定量数据，我能够：

- [ ] 正确标注横轴、纵轴、单位和刻度；
- [ ] 解释图形中一个 bin 或一个点代表什么；
- [ ] 判断分布大致对称、左偏还是右偏；
- [ ] 报告中心和离散程度，并保留原始单位；
- [ ] 指出可能的 cluster、gap、peak 或 outlier；
- [ ] 说明图形选择会如何影响观察。

## Week 4 — Unit 2 describing, measuring, and synthesis

### Learning targets

- [ ] 我能计算并解释 mean、median、range、IQR 和 standard deviation 的基本含义。
- [ ] 我能根据分布形状选择 mean/SD 或 median/IQR 作为主要描述。
- [ ] 我能解释 outlier 对 mean、median、range 和 IQR 的影响。
- [ ] 我能把统计描述写成完整、可复查的结论。

### Center and spread

**Mean** 是所有观测值的总和除以观测数，容易受到极端值影响。

**Median** 是排序后位于中间的值，对极端值更不敏感。

**Standard deviation** 反映观测值围绕 mean 的典型离散程度；本阶段先重点理解它的解释，不急于死记计算公式。

选择描述方式的经验：

- 分布大致对称且没有明显离群值：使用 mean 和 standard deviation；
- 分布偏斜或有离群值：使用 median 和 IQR；
- 报告任何统计量时，都要说明它对应的变量、群体和单位。

### Outlier rule for practice

用 IQR 规则进行初步识别：

$$
\text{lower fence} = Q_1 - 1.5(IQR)
$$

$$
\text{upper fence} = Q_3 + 1.5(IQR)
$$

落在 fences 外的观测值可以标记为 potential outlier。它是需要进一步检查的信号，不自动等于错误数据。

### Unit 2 synthesis task

选择一个单变量定量问题，例如“每天通勤时间是多少”。完成：

- [ ] 至少收集 15 个有明确单位的观测值；
- [ ] 记录数据来源、测量方式和可能的偏差；
- [ ] 制作 dotplot 或 histogram；
- [ ] 制作 boxplot 或计算五数概括；
- [ ] 计算 mean、median、range 和 IQR；
- [ ] 用 SOCS 描述分布；
- [ ] 解释 mean 和 median 是否受到偏态或离群值影响；
- [ ] 写出一个不能从这份数据推出的结论。

## Final assessment

### Part A — Data classification

为 12 个变量分类，并解释理由：

- [ ] categorical or quantitative；
- [ ] 如果是 categorical，列出可能的 categories；
- [ ] 如果是 quantitative，写出 measurement unit。

### Part B — Display and calculation

在不看答案的情况下完成：

- [ ] 从类别数据制作 frequency table 和 bar chart；
- [ ] 从双向表计算 joint、marginal 和 conditional percentages；
- [ ] 从定量数据制作 histogram 或 dotplot；
- [ ] 计算 five-number summary、range 和 IQR；
- [ ] 判断是否存在潜在离群值。

### Part C — Written interpretation

写两段完整答案：

1. 比较双向表中的两个 conditional distributions，并说明是否存在 association。
2. 用 SOCS 描述一组定量数据，并说明选择 mean/SD 或 median/IQR 的理由。

### Mastery rule

如果我能够独立完成 Part A–C，并且：

- 图表有标题、标签、单位和合理刻度；
- 百分比的分母明确；
- 结论保留数据情境；
- 没有把 association 写成 causation；
- 错误能够在 error log 中解释和修正；

那么我可以进入下一单元。

## Vocabulary tracker

| Term | 中文解释 | My own example | Confident? |
|---|---|---|---|
| categorical variable |  |  |  |
| quantitative variable |  |  |  |
| relative frequency |  |  |  |
| conditional distribution |  |  |  |
| association |  |  |  |
| distribution |  |  |  |
| skewed |  |  |  |
| median |  |  |  |
| quartile |  |  |  |
| IQR |  |  |  |
| standard deviation |  |  |  |
| outlier |  |  |  |

## Study log

| Date | Unit/session | Main idea | Evidence of learning | Next step |
|---|---|---|---|---|
| 2026-08-21 | Foundations: individuals and variables | Identify the observational unit, then classify each variable as categorical or quantitative based on whether it is a label or a meaningful numerical amount. | Began the topic using the website example and distinguished website, writers, posts, likes, and revenue. | Classify the five foundation-check examples. |
| 2026-08-21 | Lesson 2: bar graphs for categorical data | Turn category counts into bars, read frequencies, and use percentages when comparing groups of different sizes. | Studied a transportation-preference bar graph and identified its highest and lowest categories. | Practice creating a bar graph from a new frequency table. |
|  |  |  |  |  |

## Error log

| Date | Mistake | Why it happened | Correction | Recheck date |
|---|---|---|---|---|
|  |  |  |  |  |
